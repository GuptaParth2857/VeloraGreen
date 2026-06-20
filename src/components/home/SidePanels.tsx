'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Calculator, BarChart3, Trophy, Target, Award,
  Code2, MessageCircle, Camera, Link2, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/calculator', label: 'Calc', icon: Calculator },
  { href: '/dashboard', label: 'Stats', icon: BarChart3 },
  { href: '/challenges', label: 'Goals', icon: Target },
  { href: '/leaderboard', label: 'Rank', icon: Trophy },
  { href: '/badges', label: 'Awards', icon: Award },
];

const socialItems = [
  { href: '#', label: 'Github', icon: Code2 },
  { href: '#', label: 'Twitter', icon: MessageCircle },
  { href: '#', label: 'Instagram', icon: Camera },
  { href: '#', label: 'LinkedIn', icon: Link2 },
  { href: '#', label: 'Email', icon: Mail },
];

function NavIcon({ href, icon, label, isActive }: {
  href: string; icon: React.ComponentType<{ className?: string }>; label: string; isActive?: boolean;
}) {
  const IconComponent = icon;
  return (
    <Link href={href} title={label} aria-label={label} aria-current={isActive ? 'page' : undefined}>
      <div className={cn('hud-nav-icon', isActive && 'active')}>
        <IconComponent className="w-4 h-4" />
      </div>
    </Link>
  );
}

export function EcoSideNav() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block" style={{ position: 'relative', zIndex: 40 }}>
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-40"
      >
        <div
          className="w-[60px] h-[48vh] flex flex-col items-center justify-between py-6"
          style={{
            background: 'rgba(3,7,18,0.25)',
            borderTop: '1px solid rgba(6,182,212,0.12)',
            borderRight: '1px solid rgba(6,182,212,0.12)',
            backdropFilter: 'blur(16px)',
            borderTopRightRadius: '32px',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }}
          />

          <div
            className="layout-text text-[11px] tracking-[0.4em] mb-2"
            style={{ color: 'rgba(6,182,212,0.35)', fontFamily: 'Orbitron, monospace' }}
          >
            NAV
          </div>

          <div className="flex flex-col items-center gap-2">
            {navItems.map((item) => (
              <NavIcon key={item.href} {...item} isActive={pathname === item.href} />
            ))}
          </div>

          <div className="w-6 h-[1px]" style={{ background: 'rgba(6,182,212,0.2)' }} />
        </div>
      </motion.div>
    </div>
  );
}

export function EcoSocialPanel() {
  return (
    <div className="hidden lg:block" style={{ position: 'relative', zIndex: 40 }}>
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-40"
      >
        <div
          className="w-[60px] h-[48vh] flex flex-col items-center justify-between py-6"
          style={{
            background: 'rgba(3,7,18,0.25)',
            borderTop: '1px solid rgba(34,197,94,0.12)',
            borderLeft: '1px solid rgba(34,197,94,0.12)',
            backdropFilter: 'blur(16px)',
            borderTopLeftRadius: '32px',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)' }}
          />

          <div
            className="layout-text text-[11px] tracking-[0.4em] mb-2"
            style={{ color: 'rgba(34,197,94,0.35)', fontFamily: 'Orbitron, monospace' }}
          >
            SOCIAL
          </div>

          <div className="flex flex-col items-center gap-2">
            {socialItems.map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} title={label} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <div className="hud-nav-icon">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>

          <div className="w-6 h-[1px]" style={{ background: 'rgba(34,197,94,0.2)' }} />
        </div>
      </motion.div>
    </div>
  );
}
