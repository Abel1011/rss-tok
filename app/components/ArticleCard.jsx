'use client';

import { useState, useRef, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { saveArticle, removeArticle, isArticleSaved, likeArticle, unlikeArticle, isArticleLiked } from '../lib/storage';

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function ArticleCard({ article, isActive }) {
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const contentRef = useRef(null);
  const lastTapRef = useRef(0);

  // Check if article is saved on mount
  useEffect(() => {
    setIsSaved(isArticleSaved(article.link));
    setIsLiked(isArticleLiked(article.link));
  }, [article.link]);

  // Reset expanded state when card becomes inactive
  useEffect(() => {
    if (!isActive) {
      setIsExpanded(false);
    }
  }, [isActive]);

  const handleLike = () => {
    if (isLiked) {
      unlikeArticle(article.link);
      setIsLiked(false);
    } else {
      likeArticle(article);
      setIsLiked(true);
    }
  };

  // Double tap to like
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected - always like (don't toggle)
      if (!isLiked) {
        likeArticle(article);
        setIsLiked(true);
      }
      // Show heart animation
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleSave = () => {
    if (isSaved) {
      removeArticle(article.link);
      setIsSaved(false);
    } else {
      saveArticle(article);
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: article.link,
        });
      } else {
        await navigator.clipboard.writeText(article.link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const toggleExpanded = () => {
    if (article.hasFullContent) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="relative h-screen w-full flex-shrink-0 snap-start snap-always overflow-hidden bg-[#0a0a0b]">
      {/* Desktop: Split layout with image on right */}
      <div className="hidden lg:flex h-full">
        {/* Left side - Content */}
        <div className="w-1/2 h-full flex flex-col justify-center px-12 xl:px-20 relative z-10 transition-all duration-500">
          <div className={`transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Source Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
                <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
                <span className="text-white/90 text-sm font-medium">{article.source}</span>
              </div>
              <span className="text-white/40">•</span>
              <span className="text-white/50 text-sm">{formatDate(article.pubDate)}</span>
              {article.hasFullContent && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    Full article available
                  </span>
                </>
              )}
            </div>
            
            {/* Title */}
            <h2 className={`text-white font-bold leading-tight mb-6 tracking-tight transition-all ${
              isExpanded ? 'text-3xl' : 'text-4xl xl:text-5xl line-clamp-4'
            }`}>
              {article.title}
            </h2>
            
            {/* Content - Expandable */}
            {isExpanded && article.fullContent ? (
              <div className="relative max-h-[50vh] overflow-y-auto pr-4 mb-8 scrollbar-hide">
                <div className="text-white/70 text-lg leading-relaxed whitespace-pre-line">
                  {article.fullContent}
                </div>
                <div className="sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0b] to-transparent pointer-events-none" />
              </div>
            ) : (
              <p className="text-white/60 text-lg xl:text-xl leading-relaxed line-clamp-4 mb-8 max-w-xl">
                {article.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {article.hasFullContent && (
                <button
                  onClick={toggleExpanded}
                  className={`group relative px-6 py-3.5 rounded-full flex items-center gap-2.5 overflow-hidden text-base font-medium transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                      : 'bg-white text-gray-900 hover:bg-white/90 shadow-lg shadow-white/20'
                  }`}
                >
                  <span className="relative z-10">{isExpanded ? 'Show Less' : 'Read Here'}</span>
                  <svg 
                    className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative px-6 py-3.5 rounded-full flex items-center gap-2.5 overflow-hidden text-base font-medium transition-all duration-300 ${
                  article.hasFullContent 
                    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30' 
                    : 'bg-white text-gray-900 hover:bg-white/90 shadow-lg shadow-white/20'
                }`}
              >
                <span className="relative z-10">Open Original</span>
                <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <button
                onClick={handleShare}
                className="group px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 flex items-center gap-2 transition-all duration-300"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-sm font-medium">{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Desktop action buttons */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
              <button
                onClick={handleLike}
                className="group flex items-center gap-2"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isLiked ? 'bg-gradient-to-br from-red-500 to-pink-500' : 'bg-white/10 hover:bg-white/15'
                }`}>
                  <svg className={`w-5 h-5 ${isLiked ? 'text-white' : 'text-white/70'}`} fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-white/60 text-sm font-medium">{isLiked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                onClick={handleSave}
                className="group flex items-center gap-2"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSaved ? 'bg-gradient-to-br from-amber-500 to-orange-400' : 'bg-white/10 hover:bg-white/15'
                }`}>
                  <svg className={`w-5 h-5 ${isSaved ? 'text-white' : 'text-white/70'}`} fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <span className="text-white/60 text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side - Image (stays visible when expanded with darker overlay) */}
        <div className="w-1/2 h-full relative transition-all duration-500" onDoubleClick={handleDoubleTap}>
          {/* Double tap heart animation - Desktop */}
          {showHeartAnimation && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <svg 
                className="w-32 h-32 text-red-500 animate-heart-pop drop-shadow-2xl"
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-4 rounded-3xl overflow-hidden">
            <img
              src={article.image}
              alt=""
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-[2s] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className={`absolute inset-0 transition-all duration-500 ${
              isExpanded 
                ? 'bg-[#0a0a0b]/60' 
                : 'bg-gradient-to-l from-transparent via-transparent to-[#0a0a0b]/50'
            }`} />
          </div>
        </div>
      </div>

      {/* Mobile: Full screen image layout */}
      <div className="lg:hidden h-full" onClick={handleDoubleTap}>
        {/* Double tap heart animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <svg 
              className="w-32 h-32 text-red-500 animate-heart-pop drop-shadow-2xl"
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        )}

        {/* Background Image with Ken Burns effect */}
        <div className={`absolute inset-0 overflow-hidden transition-all duration-500 ${isExpanded ? 'opacity-30' : 'opacity-100'}`}>
          <img
            src={article.image}
            alt=""
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2s] ease-out ${
              isActive ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 noise-overlay" />
        </div>

        {/* Multi-layer gradient overlay */}
        <div className={`absolute inset-0 transition-all duration-500 ${isExpanded ? 'bg-[#0a0a0b]/95' : 'gradient-overlay'}`} />
        <div className="absolute inset-0 gradient-radial" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Right side action buttons (mobile only) - Hide when expanded */}
        <div 
          className={`lg:hidden absolute right-4 bottom-16 flex flex-col items-center gap-5 z-20 transition-all duration-500 ${
            isActive && !isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
          style={{ transitionDelay: isActive ? '300ms' : '0ms' }}
        >
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="group flex flex-col items-center gap-1.5"
          >
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked 
                ? 'bg-gradient-to-br from-red-500 to-pink-500 scale-110' 
                : 'glass hover:bg-white/10'
            }`}>
              <svg 
                className={`w-6 h-6 transition-all duration-300 ${isLiked ? 'text-white scale-110' : 'text-white/90'}`} 
                fill={isLiked ? 'currentColor' : 'none'} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-white/70 text-xs font-medium">Like</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="group flex flex-col items-center gap-1.5"
          >
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSaved 
                ? 'bg-gradient-to-br from-amber-500 to-orange-400 scale-110' 
                : 'glass hover:bg-white/10'
            }`}>
              <svg 
                className={`w-6 h-6 transition-all duration-300 ${isSaved ? 'text-white' : 'text-white/90'}`} 
                fill={isSaved ? 'currentColor' : 'none'} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-white/70 text-xs font-medium">Save</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="group flex flex-col items-center gap-1.5"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              copied 
                ? 'bg-emerald-500 scale-110' 
                : 'glass hover:bg-white/10'
            }`}>
              {copied ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </div>
            <span className="text-white/70 text-xs font-medium">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Read Button (if full content available) */}
          {article.hasFullContent && (
            <button
              onClick={toggleExpanded}
              className="group flex flex-col items-center gap-1.5"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-emerald-500 to-teal-500 hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-white/70 text-xs font-medium">Read</span>
            </button>
          )}
        </div>

        {/* Main Content (mobile only) */}
        <div
          className={`lg:hidden absolute inset-x-0 z-10 transition-all duration-500 ease-out ${
            isExpanded 
              ? 'top-20 bottom-0' 
              : 'bottom-0'
          } ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className={`h-full ${isExpanded ? 'overflow-y-auto scrollbar-hide' : ''}`} ref={contentRef}>
            <div className={`px-5 pb-8 md:px-8 md:pb-12 ${isExpanded ? 'pt-4' : 'pr-20 md:pr-24'}`}>
              {/* Close button when expanded */}
              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="mb-4 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back to preview</span>
                </button>
              )}

              {/* Source Badge */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">{article.source}</span>
                </div>
                <span className="text-white/40 text-sm">•</span>
                <span className="text-white/50 text-sm">{formatDate(article.pubDate)}</span>
                {article.hasFullContent && !isExpanded && (
                  <>
                    <span className="text-white/40 text-sm">•</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Full article
                    </span>
                  </>
                )}
              </div>
              
              {/* Title */}
              <h2 
                className={`text-white font-bold leading-tight mb-4 tracking-tight ${
                  isExpanded ? 'text-2xl' : 'text-2xl md:text-3xl lg:text-4xl line-clamp-3'
                }`}
                onClick={article.hasFullContent && !isExpanded ? toggleExpanded : undefined}
              >
                {article.title}
              </h2>
              
              {/* Content - Expandable */}
              {isExpanded && article.fullContent ? (
                <div className="mb-6">
                  <div className="text-white/70 text-base leading-relaxed whitespace-pre-line">
                    {article.fullContent}
                  </div>
                </div>
              ) : (
                <p 
                  className="text-white/60 text-base md:text-lg leading-relaxed line-clamp-3 mb-6 max-w-2xl"
                  onClick={article.hasFullContent ? toggleExpanded : undefined}
                >
                  {article.description}
                  {article.hasFullContent && (
                    <span className="text-[#ff6b35] font-medium"> ... tap to read more</span>
                  )}
                </p>
              )}
              
              {/* CTA Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {article.hasFullContent && (
                  <button
                    onClick={toggleExpanded}
                    className={`group relative px-6 py-3 rounded-full flex items-center gap-2 overflow-hidden transition-all ${
                      isExpanded 
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'btn-primary'
                    }`}
                  >
                    <span className="relative z-10">{isExpanded ? 'Collapse' : 'Read Here'}</span>
                    <svg 
                      className={`w-4 h-4 relative z-10 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative px-6 py-3 rounded-full flex items-center gap-2 overflow-hidden ${
                    article.hasFullContent ? 'btn-secondary' : 'btn-primary'
                  }`}
                >
                  <span className="relative z-10">Open Original</span>
                  <svg className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              
              {/* Bottom padding when expanded for scrolling */}
              {isExpanded && <div className="h-20" />}
            </div>
          </div>
        </div>

        {/* Scroll indicator - only show on first card (mobile) when not expanded */}
        {isActive && !isExpanded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
            <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>

      {/* Desktop scroll indicator */}
      {isActive && !isExpanded && (
        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-3 opacity-50">
          <span className="text-white/40 text-xs uppercase tracking-widest">Scroll or press</span>
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 rounded bg-white/10 text-white/60 text-xs font-mono">↓</kbd>
            <span className="text-white/40 text-xs">or</span>
            <kbd className="px-2 py-1 rounded bg-white/10 text-white/60 text-xs font-mono">J</kbd>
          </div>
        </div>
      )}
    </div>
  );
}
