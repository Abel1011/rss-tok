'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bookmark, RefreshCw } from 'lucide-react';
import { getSavedArticles } from '../lib/storage';
import ArticleCard from './ArticleCard';

export default function SavedCardStack({ currentIndex, onIndexChange }) {
  const [savedArticles, setSavedArticles] = useState([]);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  
  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  
  const PULL_THRESHOLD = 80;

  // Load saved articles
  const loadSavedArticles = useCallback(() => {
    setSavedArticles(getSavedArticles());
  }, []);

  useEffect(() => {
    loadSavedArticles();
  }, [loadSavedArticles]);

  const scrollToIndex = useCallback((index) => {
    if (containerRef.current && !isScrollingRef.current) {
      const card = containerRef.current.children[index];
      if (card) {
        isScrollingRef.current = true;
        card.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
      }
    }
  }, []);

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        onIndexChange(Math.min(currentIndex + 1, savedArticles.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        onIndexChange(Math.max(currentIndex - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, savedArticles.length, onIndexChange]);

  const handleScroll = useCallback(() => {
    if (containerRef.current && !isScrollingRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const cardHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / cardHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < savedArticles.length) {
        onIndexChange(newIndex);
      }
    }
  }, [currentIndex, savedArticles.length, onIndexChange]);

  // Pull to refresh - reloads saved articles from storage
  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    loadSavedArticles();
  }, [loadSavedArticles]);

  // Pull to refresh handlers (touch only)
  const handleTouchStart = useCallback((e) => {
    if (containerRef.current?.scrollTop === 0 && currentIndex === 0) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  }, [currentIndex]);

  const handleTouchMove = useCallback((e) => {
    if (!isPullingRef.current || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      const resistance = 0.4;
      setPullDistance(Math.min(diff * resistance, PULL_THRESHOLD * 1.5));
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return;
    
    isPullingRef.current = false;
    
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      
      try {
        await handleRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, handleRefresh]);

  // Empty state
  if (savedArticles.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0b]">
        <div className="text-center px-6 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Bookmark className="w-12 h-12 text-amber-500/50" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-3">No saved articles</h2>
          <p className="text-white/50 max-w-sm mx-auto leading-relaxed">
            Swipe through your feed and tap the bookmark icon to save articles for later
          </p>
        </div>
      </div>
    );
  }

  const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <div className="relative h-screen w-full">
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute left-0 right-0 z-50 flex items-center justify-center transition-opacity duration-200"
          style={{ 
            top: 80 + pullDistance,
            opacity: pullProgress,
          }}
        >
          <div 
            className={`w-10 h-10 rounded-full bg-[#0a0a0b] border-2 flex items-center justify-center shadow-xl ${
              pullDistance >= PULL_THRESHOLD ? 'border-amber-500' : 'border-white/20'
            }`}
            style={{
              transform: `scale(${0.5 + pullProgress * 0.5})`,
            }}
          >
            <RefreshCw 
              className={`w-5 h-5 transition-colors duration-200 ${
                isRefreshing ? 'animate-spin text-amber-500' : 
                pullDistance >= PULL_THRESHOLD ? 'text-amber-500' : 'text-white/60'
              }`}
              style={{ 
                transform: isRefreshing ? undefined : `rotate(${pullProgress * 180}deg)` 
              }}
            />
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ 
          scrollSnapType: 'y mandatory',
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: isPullingRef.current ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {savedArticles.map((article, index) => (
          <ArticleCard
            key={article.link}
            article={article}
            isActive={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}
