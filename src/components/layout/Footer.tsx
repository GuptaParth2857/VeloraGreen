'use client';

import Link from 'next/link';
import { Leaf, Code2, MessageCircle, Camera, Link2, ExternalLink, Mail } from 'lucide-react';

const navLinks = [
  { href: '/calculator', label: 'Calculator' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/badges', label: 'Badges' },
];

const resources = [
  { href: 'https://www.epa.gov/carbon-footprint-calculator', label: 'EPA Calculator' },
  { href: 'https://www.ipcc.ch/', label: 'IPCC Reports' },
  { href: 'https://www.unep.org/', label: 'UNEP' },
];

const socials = [
  { icon: Code2, href: '#', label: 'Github' },
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: Link2, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'rgba(3,7,18,0.3)',
        borderTop: '1px solid rgba(6,182,212,0.12)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), rgba(6,182,212,0.4), transparent)' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div
                className="w-9 h-9 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                  clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
                }}
              >
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <div
                  className="text-base font-black text-white tracking-widest"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  EcoTrace
                </div>
                <div className="text-[9px] text-cyan-400/50 tracking-[0.25em] uppercase -mt-0.5">
                  Carbon Intelligence
                </div>
              </div>
            </Link>

            <p className="text-sm text-white/35 leading-relaxed max-w-xs mb-6">
              Helping individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center transition-all duration-300 text-white/30 hover:text-cyan-400"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(6,182,212,0.1)',
                  }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-[10px] tracking-[0.35em] text-cyan-400/60 uppercase mb-5"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="w-3 h-[1px] group-hover:w-5 transition-all duration-300"
                      style={{ background: 'rgba(6,182,212,0.4)' }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="text-[10px] tracking-[0.35em] text-cyan-400/60 uppercase mb-5"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resources.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                  >
                    {label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}
        >
          <p
            className="text-[10px] text-white/25 tracking-wider"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            © 2024 EcoTrace. Building a sustainable future.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse" />
            <span
              className="text-[9px] tracking-[0.3em] text-green-400/40 uppercase"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
