'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileImage, FileText, Share2, Link2, Check } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAppStore } from '@/store/useAppStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function ShareButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentResult } = useAppStore();

  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('ecotrace-share');
      if (!element) return;
      const canvas = await html2canvas(element, {
        backgroundColor: '#111827', scale: 2, useCORS: true, logging: false,
      });
      const link = document.createElement('a');
      link.download = `ecotrace-report-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('ecotrace-share');
      if (!element) return;
      const canvas = await html2canvas(element, {
        backgroundColor: '#111827', scale: 2, useCORS: true, logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ecotrace-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const shareLink = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'EcoTrace - My Carbon Footprint', url });
        return;
      } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <GlassButton
        variant="secondary"
        onClick={() => setShowMenu(!showMenu)}
        disabled={!currentResult}
      >
        <Share2 className="w-4 h-4" />
        Share Results
      </GlassButton>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden z-50"
          >
            <button
              onClick={exportAsImage}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              <FileImage className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Download as PNG'}
            </button>
            <button
              onClick={exportAsPDF}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Download as PDF'}
            </button>
            <button
              onClick={shareLink}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-eco-400" /> : <Link2 className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Copy Share Link'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
