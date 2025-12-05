'use client';

import { useState, useCallback } from 'react';

const DEFAULT_FEED_URL = 'https://feeds.arstechnica.com/arstechnica/technology-lab';

export function useAppState() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // Can be a string (single feed) or array of strings (multiple feeds)
  const [currentFeedUrl, setCurrentFeedUrl] = useState(DEFAULT_FEED_URL);

  const goToIndex = useCallback((index, total) => {
    if (index >= 0 && index < total) {
      setCurrentIndex(index);
    }
  }, []);

  const goNext = useCallback((total) => {
    setCurrentIndex(prev => Math.min(prev + 1, total - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpen(prev => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  // Accepts either a single URL string or array of URLs
  const changeFeed = useCallback((urlOrUrls) => {
    setCurrentFeedUrl(urlOrUrls);
    setCurrentIndex(0);
    setIsPanelOpen(false);
  }, []);

  const isMultiFeed = Array.isArray(currentFeedUrl);

  return {
    currentIndex,
    isPanelOpen,
    currentFeedUrl,
    isMultiFeed,
    goToIndex,
    goNext,
    goPrev,
    togglePanel,
    closePanel,
    changeFeed,
  };
}
