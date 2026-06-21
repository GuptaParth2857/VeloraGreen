'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Calculator, BarChart3, Trophy, Target, Award, Leaf, LogIn, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';
import { LoginModal } from '@/components/LoginModal';

const navItems = [
  { href: '/calculator', label: 'Calculator', icon: Calculator, short: 'CALC' },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3, short: 'STATS' },
  { href: '/challenges', label: 'Challenges', icon: Target, short: 'GOALS' },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, short: 'RANK' },
  { href: '/badges', label: 'Badges', icon: Award, short: 'AWARDS' },
];

function NavLink({ item, isActive }: { item: typeof navItems[0]; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 tracking-wider uppercase',
        isActive
          ? 'text-cyan-400'
          : 'text-white/40 hover:text-white/80'
      )}
      style={{ fontFamily: 'Orbitron, monospace' }}
    >
      <item.icon className="w-3 h-3" aria-hidden="true" />
      <span className="sr-only">{item.label}</span>
      {item.short}
      {isActive && (
        <motion.span
          className="absolute -bottom-[1px] left-0 right-0 h-[2px]"
          layoutId="nav-underline"
          style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.8), rgba(6,182,212,0.8))' }}
        />
      )}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 hidden lg:block transition-all duration-500',
          scrolled ? 'backdrop-blur-xl' : ''
        )}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.6), rgba(6,182,212,0.6), transparent)' }}
        />

        <div
          className="flex items-center h-[60px] relative"
          style={{ background: 'rgba(3,7,18,0.3)', borderBottom: '1px solid rgba(6,182,212,0.12)' }}
        >
          <div className="flex items-center h-full">
            <Link href="/" className="flex items-center gap-2.5 px-6 h-full border-r border-cyan-400/10 hover:bg-cyan-400/5 transition-colors group">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-sm group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #22c55e, #06b6d4)', clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
              >
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <span
                  className="text-sm font-black text-white tracking-widest block"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  VeloraGreen


                </span>
                <span className="text-[10px] text-cyan-400/50 tracking-[0.25em] uppercase block -mt-0.5">
                  Carbon Intelligence
                </span>
              </div>
            </Link>

            <nav className="flex items-center h-full px-4 gap-1">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} isActive={pathname === item.href} />
              ))}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-0 h-full">
            {user ? (
              <div className="flex items-center gap-2 px-4 h-full border-l border-cyan-400/10">
                <span className="text-sm" aria-hidden="true">{user.avatar}</span>
                <span className="text-[10px] text-white/70 tracking-wider max-w-[80px] truncate" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="ml-1 p-1 text-white/40 hover:text-red-400 transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-5 h-full border-l border-cyan-400/10 text-[10px] font-bold tracking-widest uppercase text-cyan-400/70 hover:text-cyan-300 transition-all"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                <LogIn className="w-3 h-3" />
                Sign In
              </button>
            )}

            <div className="flex items-center px-5 h-full border-l border-cyan-400/10">
              <span
                className="text-[11px] font-mono text-cyan-400/60 tracking-wider tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {time}
              </span>
            </div>

            <Link href="/calculator" className="h-full">
              <div
                className="h-full px-6 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/80 hover:text-white transition-all duration-300 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(6,182,212,0.12))',
                  borderLeft: '1px solid rgba(34,197,94,0.2)',
                  fontFamily: 'Orbitron, monospace',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 group-hover:animate-ping" style={{ minWidth: 8 }} />
                Calculate Now
              </div>
            </Link>
          </div>
        </div>

        <div
          className="h-[1px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), rgba(34,197,94,0.2), transparent)' }}
        />
      </header>

      <header
        className="fixed top-0 left-0 w-full z-50 lg:hidden"
        style={{ background: 'rgba(3,7,18,0.4)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(6,182,212,0.12)' }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22c55e, #06b6d4)', clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="text-sm font-black text-white tracking-widest"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              VeloraGreen
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-sm transition-all duration-300"
            style={{ border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.05)' }}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              : <Menu className="w-5 h-5 text-white/70" aria-hidden="true" />
            }
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(3,7,18,0.4)', borderBottom: '1px solid rgba(6,182,212,0.1)' }}
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all',
                        isActive
                          ? 'text-cyan-400 border-l-2 border-cyan-400 bg-cyan-400/5'
                          : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                      )}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
