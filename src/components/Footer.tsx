'use client';

import Link from 'next/link';
import { FiHeart, FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { Leaf } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { href: '/calculator', label: '📊 Carbon Calculator' },
        { href: '/dashboard', label: '📈 Dashboard' },
        { href: '/challenges', label: '🎯 Challenges' },
        { href: '/badges', label: '🏆 Badges' },
        { href: '/leaderboard', label: '👥 Leaderboard' },
        { href: '/recommendations', label: '💡 Tips' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: 'https://www.epa.gov/carbon-footprint-calculator', label: '📋 EPA Calculator' },
        { href: 'https://www.ipcc.ch/', label: '📚 IPCC Reports' },
        { href: 'https://www.unep.org/', label: '🌍 UNEP' },
        { href: 'https://ourworldindata.org/', label: '📊 Our World in Data' },
        { href: 'https://www.carbonbrief.org/', label: '📰 Carbon Brief' },
      ]
    },
    {
      title: 'Company',
      links: [
        { href: '/', label: '🏠 Home' },
        { href: '/about', label: 'ℹ️ About Us' },
        { href: '/contact', label: '📞 Contact' },
        { href: '/privacy', label: '🔒 Privacy Policy' },
        { href: '/terms', label: '📜 Terms of Service' },
      ]
    },
  ];

  return (
    <footer className="bg-slate-950 text-white relative z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                <Leaf className="text-white" size={24} />
              </div>
              <span className="font-black text-2xl text-white font-outfit">Velora<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Green</span></span>
            </Link>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              Track, reduce, and offset your carbon footprint. Join thousands of people taking action against climate change with personalized insights and gamified challenges.
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FiMail className="text-green-400 shrink-0" size={14} />
                <a href="mailto:hello@veloragreen.com" className="hover:text-green-400">hello@veloragreen.com</a>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FiMapPin className="text-green-400 shrink-0" size={14} />
                <span>Global — Working for a sustainable future</span>
              </div>
            </div>

            <div className="flex gap-3">
              {[
                { Icon: FiTwitter, href: '#' },
                { Icon: FiInstagram, href: '#' },
                { Icon: FiLinkedin, href: '#' },
                { Icon: FaYoutube, href: '#' },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-green-500/20 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {footerSections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
            >
              <h4 className="font-bold text-sm mb-4 text-green-400">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-green-400 transition"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-green-400 transition"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm flex items-center gap-1">
            © 2026 VeloraGreen. Made with <FiHeart className="text-green-500" size={14} /> for our planet.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] text-green-400/60 uppercase font-mono">
              Carbon Neutral Hosting
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
