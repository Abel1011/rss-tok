'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { getLikedArticles } from '../lib/storage';
import ArticleCard from './ArticleCard';

export default function LikedCardStack({ currentIndex, onIndexChange }) {
  const [likedArticles, setLikedArticles] = useState([]);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  
  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  
  const PULL_THRESHOLD = 80;

  // Load liked articles
  const loadLikedArticles = useCallback(() => {
    setLikedArticles(getLikedArticles());
  }, []);

  useEffect(() => {
    loadLikedArticles();
  }, [loadLikedArticles]);

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
        onIndexChange(Math.min(currentIndex + 1, likedArticles.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        onIndexChange(Math.max(currentIndex - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, likedArticles.length, onIndexChange]);

  const handleScroll = useCallback(() => {
    if (containerRef.current && !isScrollingRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const cardHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / cardHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < likedArticles.length) {
        onIndexChange(newIndex);
      }
    }
  }, [currentIndex, likedArticles.length, onIndexChange]);

  // Pull to refresh - reloads liked articles from storage
  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    loadLikedArticles();
  }, [loadLikedArticles]);

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
    
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      await handleRefresh();
      setIsRefreshing(false);
    }
    
    setPullDistance(0);
  }, [pullDistance, isRefreshing, handleRefresh]);

  if (likedArticles.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center px-6 bg-[#0a0a0b]">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ff6b35]/20 to-[#ff8c42]/20 flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-[#ff6b35]/70" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">No liked articles</h2>
        <p className="text-white/50 text-center max-w-sm">
          Articles you like will appear here. Tap the heart icon on any article to like it!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ top: 80 + pullDistance }}
        >
          <div className={`p-3 rounded-full glass ${isRefreshing ? 'bg-[#ff6b35]/20' : 'bg-white/10'}`}>
            <RefreshCw 
              className={`w-6 h-6 text-[#ff6b35] transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ 
                transform: isRefreshing ? undefined : `rotate(${pullDistance * 3}deg)`,
                opacity: Math.min(pullDistance / PULL_THRESHOLD, 1)
              }}
            />
          </div>
        </div>
      )}
      
      {likedArticles.map((article, index) => (
        <ArticleCard
          key={article.link}
          article={article}
          isActive={index === currentIndex}
        />
      ))}
    </div>
  );
}
