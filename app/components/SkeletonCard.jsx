'use client';

export default function SkeletonCard() {
  return (
    <div className="relative h-screen w-full flex-shrink-0 snap-start snap-always overflow-hidden bg-[#0a0a0b]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/5 via-transparent to-[#ff8c42]/5" />
      
      {/* Decorative shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ff6b35]/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#ff8c42]/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-overlay" />
      
      {/* Right side buttons skeleton */}
      <div className="absolute right-4 bottom-44 flex flex-col items-center gap-6 z-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-full bg-white/5 animate-shimmer" />
            <div className="w-8 h-2 rounded bg-white/5" />
          </div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 md:px-8 md:pb-12 pr-20 md:pr-24">
        {/* Source badge skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-32 rounded-full bg-white/5 animate-shimmer" />
          <div className="h-4 w-16 rounded bg-white/5 animate-shimmer" style={{ animationDelay: '0.2s' }} />
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-3 mb-4">
          <div className="h-8 w-full rounded-lg bg-white/10 animate-shimmer" />
          <div className="h-8 w-4/5 rounded-lg bg-white/10 animate-shimmer" style={{ animationDelay: '0.1s' }} />
          <div className="h-8 w-3/5 rounded-lg bg-white/8 animate-shimmer" style={{ animationDelay: '0.2s' }} />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-5 w-full rounded bg-white/5 animate-shimmer" style={{ animationDelay: '0.3s' }} />
          <div className="h-5 w-5/6 rounded bg-white/5 animate-shimmer" style={{ animationDelay: '0.4s' }} />
          <div className="h-5 w-4/6 rounded bg-white/5 animate-shimmer" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-36 rounded-full bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c42]/20 animate-shimmer" />
          <div className="h-12 w-24 rounded-full bg-white/5 animate-shimmer" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#ff6b35]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#ff6b35] animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#ff8c42] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <span className="text-white/40 text-sm font-medium tracking-wide">Loading feed...</span>
      </div>
    </div>
  );
}
