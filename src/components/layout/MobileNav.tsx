'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calculator, BarChart3, Target, Award, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/calculator', label: 'Calc', icon: Calculator },
  { href: '/dashboard', label: 'Stats', icon: BarChart3 },
  { href: '/challenges', label: 'Goals', icon: Target },
  { href: '/badges', label: 'Badges', icon: Award },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(3,7,18,0.4)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(6,182,212,0.12)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), rgba(6,182,212,0.4), transparent)' }}
      />

      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300',
                isActive ? 'text-cyan-400' : 'text-white/35 hover:text-white/70'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span
                className="text-[9px] font-semibold tracking-wider uppercase"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute -bottom-0 w-8 h-[2px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, #22c55e, #06b6d4)' }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
