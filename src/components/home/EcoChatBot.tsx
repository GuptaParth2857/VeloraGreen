'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';

export function EcoChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Initiating Eco-Bot protocol... How can I assist you in reducing your carbon footprint today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const userText = input;
    setInput('');

    setTimeout(() => {
      let reply = "That's an interesting question! A great way to reduce your footprint is by optimizing your energy usage and choosing sustainable transport.";
      if (userText.toLowerCase().includes('flight') || userText.toLowerCase().includes('travel')) {
        reply = "Air travel is a major source of emissions. Try to offset your flights or choose trains for shorter journeys.";
      } else if (userText.toLowerCase().includes('meat') || userText.toLowerCase().includes('food')) {
        reply = "Switching to a plant-based diet for just 2 days a week can significantly reduce your carbon emissions.";
      }
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-24 right-4 lg:right-24 z-50 hidden lg:block cursor-pointer"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
      >
        {!isOpen && (
          <div className="relative group" onClick={() => setIsOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setIsOpen(true)} aria-label="Open Eco-Advisor AI chat">
            <div
              className="absolute inset-0 rounded-sm blur-xl opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent)' }}
            />
            <div
              className="relative w-14 h-14 flex items-center justify-center"
              style={{
                background: 'rgba(3,7,18,0.4)',
                border: '1px solid rgba(6,182,212,0.35)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Bot className="w-6 h-6 text-cyan-400" aria-hidden="true" />
            </div>
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
              style={{ background: '#06b6d4', boxShadow: '0 0 8px rgba(6,182,212,0.8)' }}
            />
            <div
              className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap px-3 py-1.5 text-[10px] tracking-widest uppercase text-cyan-400"
              style={{
                background: 'rgba(3,7,18,0.4)',
                border: '1px solid rgba(6,182,212,0.2)',
                fontFamily: 'Orbitron, monospace',
              }}
            >
              Eco-Advisor AI
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 lg:right-24 z-50 w-80 h-96 layout-panel flex flex-col"
            style={{ borderRadius: '16px' }}
          >
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-tr" />

            <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/20">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-rajdhani font-bold text-cyan-400 uppercase tracking-widest">Eco-Bot V1</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors" aria-label="Close chat">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-500/30'
                      : 'bg-white/5 text-white/90 border border-white/10'
                  }`}
                  style={{
                    clipPath: m.role === 'user'
                      ? 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                      : 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-cyan-500/20 bg-black/20">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  aria-label="Type your message"
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
                <GlassButton variant="secondary" size="sm" onClick={handleSend} className="px-3" aria-label="Send message">
                  <Send className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                </GlassButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
