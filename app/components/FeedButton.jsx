'use client';

export default function FeedButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-50 group"
      aria-label="Open feed options"
    >
      <div className="relative">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50" />
        
        {/* Button */}
        <div className="relative w-14 h-14 rounded-2xl glass flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10 animate-border-dance border border-[#ff6b35]/30">
          {/* RSS Icon */}
          <svg
            className="w-6 h-6 text-[#ff6b35] transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff6b35] animate-pulse" />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
        <span className="text-white text-sm font-medium">Change Feed</span>
      </div>
    </button>
  );
}
