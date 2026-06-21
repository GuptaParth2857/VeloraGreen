'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiBarChart2, FiTarget, FiAward, FiUsers, FiStar, FiTrendingUp } from 'react-icons/fi';
import { Calculator, Leaf } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/calculator', label: 'Calculator', icon: Calculator },
    { href: '/dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { href: '/challenges', label: 'Challenges', icon: FiTarget },
    { href: '/badges', label: 'Badges', icon: FiAward },
    { href: '/leaderboard', label: 'Leaderboard', icon: FiUsers },
    { href: '/recommendations', label: 'Tips', icon: FiTrendingUp },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-black/20 py-2 border-b border-white/5'
            : 'bg-slate-950/70 backdrop-blur-md py-3 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="VeloraGreen — Go to homepage"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              >
                <Leaf className="text-white" size={20} />
              </motion.div>
              <span className="font-black text-xl text-white font-outfit">
                Velora<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Green</span>
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {mainLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    pathname === link.href
                      ? 'text-white bg-green-500/15'
                      : 'text-gray-400 hover:text-white hover:bg-white/8'
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  <link.icon className="inline-block mr-1.5 mb-0.5" size={14} />
                  {link.label}
                  <span
                    className={`absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-300 ${
                      pathname === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                href="/calculator"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-xl transition text-sm font-semibold shadow-[0_0_15px_rgba(34,197,94,0.25)]"
              >
                <Calculator size={14} />
                <span>Calculate Now</span>
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(v => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/8 transition"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-white/5 overflow-hidden bg-slate-950/95 backdrop-blur-xl"
            >
              <nav className="flex flex-col p-4 gap-1" role="navigation" aria-label="Mobile navigation">
                {mainLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className={`py-3 px-4 rounded-xl font-medium flex items-center gap-2 transition ${
                        pathname === link.href
                          ? 'bg-green-500/15 text-green-300'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <Link
                    href="/calculator"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold transition shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                  >
                    <Calculator size={16} />
                    <span>Calculate Your Footprint</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
