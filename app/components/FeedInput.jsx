'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { validateUrl } from '../lib/validation';

export default function FeedInput({ onSubmit, onAddToMix, isLoading, hasSelection }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const validateAndGetUrl = () => {
    setError(null);

    if (!url.trim()) {
      setError('Please enter a URL');
      return null;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return null;
    }

    return url.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validUrl = validateAndGetUrl();
    if (validUrl) {
      onSubmit(validUrl);
      setUrl('');
    }
  };

  const handleAddToMix = () => {
    const validUrl = validateAndGetUrl();
    if (validUrl && onAddToMix) {
      onAddToMix(validUrl);
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-3">
        {/* Input container */}
        <div className={`relative rounded-2xl transition-all duration-300 ${
          isFocused 
            ? 'ring-2 ring-[#ff6b35]/50 ring-offset-2 ring-offset-[#111113]' 
            : ''
        }`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c42]/20 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
          
          <div className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:border-white/20">
            <svg className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${isFocused ? 'text-[#ff6b35]' : 'text-white/40'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Paste any RSS feed URL..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none disabled:opacity-50"
            />
            
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 px-1 animate-slide-up">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex gap-2">
          {/* Add to Mix button */}
          {onAddToMix && (
            <button
              type="button"
              onClick={handleAddToMix}
              disabled={isLoading || !url.trim()}
              className="relative group overflow-hidden px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border border-purple-500/30 hover:border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20"
            >
              <span className="relative flex items-center justify-center gap-2 text-purple-400">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add to Mix</span>
              </span>
            </button>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex-1 relative group overflow-hidden px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
          {/* Button background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c42] to-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Button content */}
          <span className="relative flex items-center justify-center gap-2 text-white">
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Transforming...</span>
              </>
            ) : (
              <>
                <span>Transform Feed</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>
        </div>
      </div>
    </form>
  );
}
