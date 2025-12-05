'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import ArticleCard from './ArticleCard';
import SkeletonCard from './SkeletonCard';

export default function CardStack({
  articles,
  currentIndex,
  onIndexChange,
  isLoading,
  total,
  onRefresh,
}) {
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  
  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  
  const PULL_THRESHOLD = 80;

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
        const newIndex = Math.min(currentIndex + 1, total - 1);
        // Pass current article link to mark as read
        const currentArticle = articles[currentIndex];
        onIndexChange(newIndex, currentArticle?.link);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        onIndexChange(Math.max(currentIndex - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total, onIndexChange, articles]);

  const handleScroll = useCallback(() => {
    if (containerRef.current && !isScrollingRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const cardHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / cardHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < total) {
        // Pass current article link to mark as read when scrolling forward
        const currentArticle = articles[currentIndex];
        if (newIndex > currentIndex) {
          onIndexChange(newIndex, currentArticle?.link);
        } else {
          onIndexChange(newIndex);
        }
      }
    }
  }, [currentIndex, total, onIndexChange, articles]);

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
    
    if (pullDistance >= PULL_THRESHOLD && onRefresh) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh]);

  if (isLoading) {
    return (
      <div className="h-screen w-full overflow-hidden">
        <SkeletonCard />
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
              pullDistance >= PULL_THRESHOLD ? 'border-[#ff6b35]' : 'border-white/20'
            }`}
            style={{
              transform: `scale(${0.5 + pullProgress * 0.5})`,
            }}
          >
            <RefreshCw 
              className={`w-5 h-5 transition-colors duration-200 ${
                isRefreshing ? 'animate-spin text-[#ff6b35]' : 
                pullDistance >= PULL_THRESHOLD ? 'text-[#ff6b35]' : 'text-white/60'
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
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            isActive={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}
