'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Create procedural earth texture using shader
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simple noise function
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float fbm(vec2 p) {
          float total = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 5; i++) {
            total += noise(p) * amplitude;
            p *= 2.0;
            amplitude *= 0.5;
          }
          return total;
        }
        
        void main() {
          // Create continent-like shapes using noise
          vec2 uv = vUv * 8.0;
          float continent = fbm(uv + vec2(2.0, 1.0));
          float detail = fbm(uv * 4.0);
          
          // Ocean color (deep blue)
          vec3 oceanDeep = vec3(0.02, 0.1, 0.3);
          vec3 oceanShallow = vec3(0.05, 0.2, 0.4);
          vec3 ocean = mix(oceanDeep, oceanShallow, detail * 0.5);
          
          // Land colors
          vec3 landGreen = vec3(0.1, 0.4, 0.15);
          vec3 landBrown = vec3(0.4, 0.3, 0.15);
          vec3 snow = vec3(0.9, 0.95, 1.0);
          
          // Determine if land or ocean
          float threshold = 0.45;
          vec3 land = mix(landGreen, landBrown, detail);
          
          // Add snow near poles
          float latitude = abs(vUv.y - 0.5) * 2.0;
          if (latitude > 0.7) {
            land = mix(land, snow, (latitude - 0.7) * 3.0);
          }
          
          vec3 color = mix(ocean, land, smoothstep(threshold - 0.05, threshold + 0.05, continent));
          
          // Add atmosphere rim lighting
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          rim = pow(rim, 3.0);
          color += vec3(0.1, 0.3, 0.5) * rim * 0.5;
          
          // Add subtle cloud layer
          float clouds = fbm(uv * 2.0 + vec2(0.5, 0.3));
          clouds = smoothstep(0.4, 0.6, clouds);
          color = mix(color, vec3(1.0), clouds * 0.3);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  const cloudsMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        void main() {
          vec2 uv = vUv * 6.0;
          float clouds = noise(uv + vec2(0.5, 0.3));
          clouds = smoothstep(0.35, 0.65, clouds);
          gl_FragColor = vec4(1.0, 1.0, 1.0, clouds * 0.4);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((_state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <group>
        {/* Earth sphere with procedural texture */}
        <Sphere ref={earthRef} args={[1, 64, 32]} material={earthMaterial} />

        {/* Cloud layer */}
        <Sphere ref={cloudsRef} args={[1.02, 32, 16]} material={cloudsMaterial} />

        {/* Atmosphere glow */}
        <Sphere args={[1.15, 32, 16]}>
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  );
}

const DEFAULT_PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(150 * 3);
  for (let i = 0; i < 150; i++) {
    const radius = 2 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = radius * Math.cos(phi);
  }
  return pos;
})();

function Particles({ count = 150 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[DEFAULT_PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#22c55e"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4a9eff" />

      <Stars
        radius={80}
        depth={50}
        count={2500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <Earth />
      <Particles count={120} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

export function Earth3D() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
