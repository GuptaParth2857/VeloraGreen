'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2, Leaf, Upload } from 'lucide-react';

interface AnalysisResult {
  foodName?: string;
  category?: string;
  estimatedCO2Kg?: number;
  explanation?: string;
  greenerAlternative?: string;
  description?: string;
  estimatedImpact?: string;
  tip?: string;
}

export function VisionAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'food' | 'receipt' | 'general'>('food');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    setAnalysis(null);
    setError('');
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, type: mode }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnalysis(data.analysis);
      }
    } catch {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setError('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-50 w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Analyze image with AI"
      >
        <Camera className="w-5 h-5 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-44 left-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="AI Vision Analyzer"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-green-600/20 to-emerald-600/10">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-green-400" />
                <span className="text-white font-semibold text-sm">AI Vision</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); reset(); }}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                {(['food', 'receipt', 'general'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); reset(); }}
                    className={`flex-1 px-3 py-1.5 text-xs rounded-md capitalize transition-colors ${
                      mode === m ? 'bg-green-600 text-white' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {m === 'food' ? '🍽️ Food' : m === 'receipt' ? '🧾 Receipt' : '🌿 General'}
                  </button>
                ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                aria-hidden="true"
              />

              {!image ? (
                <button
                  onClick={handleCapture}
                  className="w-full h-40 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-500/40 hover:bg-white/5 transition-colors"
                >
                  <Upload className="w-8 h-8 text-white/30" />
                  <span className="text-sm text-white/40">Tap to upload an image</span>
                  <span className="text-[10px] text-white/20">
                    Analyze carbon impact with Gemini AI
                  </span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Captured" className="w-full h-40 object-cover rounded-xl" />
                    <button
                      onClick={reset}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>

                  {!analysis && !isLoading && !error && (
                    <button
                      onClick={handleAnalyze}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
                    >
                      <Leaf className="w-4 h-4" />
                      Analyze Carbon Impact
                    </button>
                  )}

                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 py-4">
                      <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                      <span className="text-sm text-white/60">Analyzing with Gemini AI...</span>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}

                  {analysis && (
                    <div className="space-y-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                      {analysis.foodName && (
                        <p className="text-white font-medium">{analysis.foodName}</p>
                      )}
                      {analysis.estimatedCO2Kg !== undefined && (
                        <p className="text-sm">
                          <span className="text-white/60">Carbon impact: </span>
                          <span className="text-green-400 font-semibold">{analysis.estimatedCO2Kg} kg CO₂e</span>
                        </p>
                      )}
                      {analysis.explanation && (
                        <p className="text-sm text-white/60">{analysis.explanation}</p>
                      )}
                      {analysis.greenerAlternative && (
                        <p className="text-sm text-green-300">💡 {analysis.greenerAlternative}</p>
                      )}
                      {analysis.tip && (
                        <p className="text-sm text-green-300">💡 {analysis.tip}</p>
                      )}
                      {analysis.estimatedImpact && (
                        <p className="text-sm">
                          <span className="text-white/60">Impact: </span>
                          <span className={
                            analysis.estimatedImpact === 'low' ? 'text-green-400' :
                            analysis.estimatedImpact === 'medium' ? 'text-yellow-400' : 'text-red-400'
                          }>
                            {analysis.estimatedImpact}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
