'use client';

import { useEffect } from 'react';
import { X, Rss, Shield, Eye, Zap, Heart, Github } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] animate-fade-in"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg pointer-events-auto animate-scale-in">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0d0d0f]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff6b35]/10 via-transparent to-transparent" />
            
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent" />

            {/* Content */}
            <div className="relative p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] flex items-center justify-center shadow-lg shadow-[#ff6b35]/25">
                    <Rss className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">RSS-Tok</h2>
                    <p className="text-[#ff6b35] text-sm font-medium">Feed Resurrected</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* What is RSS */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">📡</span> What is RSS?
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  RSS (Really Simple Syndication) was the backbone of the open web in the 2000s. 
                  It let you subscribe to any website and get updates without algorithms deciding what you see. 
                  When Google Reader shut down in 2013, RSS faded from mainstream use—but it never died.
                </p>
              </div>

              {/* Why we built this */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-lg">✨</span> Why RSS-Tok?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">No algorithms</p>
                      <p className="text-white/50 text-xs">You choose what you see, not an AI</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">No tracking</p>
                      <p className="text-white/50 text-xs">Your reading habits stay private</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Modern experience</p>
                      <p className="text-white/50 text-xs">TikTok-style UX meets open web values</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hackathon badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ff6b35]/10 to-[#ff8c42]/10 border border-[#ff6b35]/20">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <p className="text-white text-sm font-medium">Built for Resurrection Hackathon</p>
                    <p className="text-white/50 text-xs">Bringing dead tech back to life with modern innovation</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-white/40 text-xs flex items-center gap-1">
                  Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for the open web
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs">v0.1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
