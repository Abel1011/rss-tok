'use client';

export default function ProgressIndicator({ current, total }) {
  if (total === 0) return null;

  const progress = ((current + 1) / total) * 100;

  return (
    <>
      {/* Mobile: Right side vertical */}
      <div className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
        {/* Vertical Progress Bar */}
        <div className="relative h-32 w-1 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#ff6b35] to-[#ff8c42] rounded-full transition-all duration-500 ease-out"
            style={{ height: `${progress}%` }}
          />
          {/* Glow effect */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ff6b35] blur-md transition-all duration-500"
            style={{ bottom: `calc(${progress}% - 8px)` }}
          />
        </div>
        
        {/* Counter */}
        <div className="glass rounded-full px-3 py-2 flex flex-col items-center">
          <span className="text-white font-bold text-sm tabular-nums">
            {current + 1}
          </span>
          <div className="w-4 h-px bg-white/20 my-1" />
          <span className="text-white/50 text-xs tabular-nums">
            {total}
          </span>
        </div>
      </div>

      {/* Desktop: Bottom horizontal bar */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-40">
        <div className="relative h-1 bg-white/5">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Glow effect at the end */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff6b35] blur-sm transition-all duration-500"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
        
        {/* Counter badge */}
        <div className="absolute bottom-4 right-8 glass rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-white font-bold tabular-nums">{current + 1}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/50 tabular-nums">{total}</span>
          <span className="text-white/30 text-sm ml-1">articles</span>
        </div>
      </div>
    </>
  );
}
