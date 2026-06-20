'use client';

import dynamic from 'next/dynamic';

const EcoChatBotInner = dynamic(() => import('@/components/home/EcoChatBot').then(m => m.EcoChatBot), { ssr: false });
const ParticleBackgroundInner = dynamic(() => import('@/components/home/ParticleBackground').then(m => m.ParticleBackground), { ssr: false });

export function DynamicEcoChatBot() {
  return <EcoChatBotInner />;
}

export function DynamicParticleBackground() {
  return <ParticleBackgroundInner />;
}
