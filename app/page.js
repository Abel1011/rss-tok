'use client';

import { useState, useEffect, useMemo } from 'react';
import { Info, Bookmark, Rss, Plus, Compass, Heart, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { useFeed } from './hooks/useFeed';
import { useAppState } from './hooks/useAppState';
import { useTheme } from './hooks/useTheme';
import { addRecentFeed, getSavedArticles, getLikedArticles, markAsRead, isArticleRead, getHideReadPreference, setHideReadPreference } from './lib/storage';
import CardStack from './components/CardStack';
import SavedCardStack from './components/SavedCardStack';
import LikedCardStack from './components/LikedCardStack';
import ProgressIndicator from './components/ProgressIndicator';
import FeedPanel from './components/FeedPanel';
import ThemeToggle from './components/ThemeToggle';
import InfoModal from './components/InfoModal';
import StatsModal from './components/StatsModal';

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [activeView, setActiveView] = useState('feed'); // 'feed', 'likes', or 'saved'
  const [savedIndex, setSavedIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [likedIndex, setLikedIndex] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [hideRead, setHideRead] = useState(false);
  const [readArticlesVersion, setReadArticlesVersion] = useState(0);
  const {
    currentIndex,
    isPanelOpen,
    currentFeedUrl,
    goToIndex,
    togglePanel,
    closePanel,
    changeFeed,
  } = useAppState();

  const { articles, isLoading, error, isMultiFeed, sourceCount, refresh } = useFeed(currentFeedUrl);

  // Load hide read preference on mount
  useEffect(() => {
    setHideRead(getHideReadPreference());
  }, []);

  // Filter articles based on read status
  const filteredArticles = useMemo(() => {
    if (!hideRead) return articles;
    return articles.filter(article => !isArticleRead(article.link));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, hideRead, readArticlesVersion]);

  // Update saved count when view changes
  useEffect(() => {
    if (activeView === 'saved') {
      setSavedCount(getSavedArticles().length);
    } else if (activeView === 'likes') {
      setLikedCount(getLikedArticles().length);
    }
  }, [activeView]);

  const handleFeedSelect = (urlOrUrls) => {
    // Add to recent feeds (only single URLs)
    if (!Array.isArray(urlOrUrls)) {
      addRecentFeed(urlOrUrls);
    }
    changeFeed(urlOrUrls);
  };

  const handleIndexChange = (index, articleLink) => {
    goToIndex(index, filteredArticles.length);
    // Mark current article as read when moving to next
    if (articleLink) {
      markAsRead(articleLink);
      setReadArticlesVersion(v => v + 1);
    }
  };

  const handleToggleHideRead = () => {
    const newValue = !hideRead;
    setHideRead(newValue);
    setHideReadPreference(newValue);
    // Reset index when toggling filter
    goToIndex(0, filteredArticles.length);
  };

  const handleToggleFeed = (url) => {
    setSelectedFeeds(prev => 
      prev.includes(url) 
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };

  const handleClearSelection = () => {
    setSelectedFeeds([]);
  };

  const handleSelectAll = (urls) => {
    setSelectedFeeds(urls);
  };


  if (error && !isLoading) {
    return (
      <main className="h-screen w-full bg-[#0a0a0b] flex items-center justify-center p-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#ff8c42]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative text-center max-w-md animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#ff6b35]/20 to-[#ff8c42]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#ff6b35]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-bold mb-3">Oops!</h1>
          <p className="text-white/60 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={togglePanel}
            className="px-8 py-4 btn-primary rounded-2xl text-lg"
          >
            Try Another Feed
          </button>
        </div>
        <FeedPanel
          isOpen={isPanelOpen}
          onClose={closePanel}
          onFeedSelect={handleFeedSelect}
          isLoading={isLoading}
          selectedFeeds={selectedFeeds}
          onToggleFeed={handleToggleFeed}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
        />
      </main>
    );
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-[#0a0a0b]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          {/* Logo - Full on desktop, icon only on mobile */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
            </div>
            {/* Full logo text - desktop only */}
            <div className="hidden lg:block">
              <h1 className="text-white font-bold text-lg tracking-tight">RSS-Tok</h1>
              <p className="text-white/40 text-xs">Feed Resurrected</p>
            </div>
            {/* Stats Button */}
            <button
              onClick={() => setIsStatsOpen(true)}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
              aria-label="Statistics"
            >
              <BarChart3 className="w-4 h-4 text-white/50" />
            </button>
            {/* Info Button */}
            <button
              onClick={() => setIsInfoOpen(true)}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
              aria-label="About RSS-Tok"
            >
              <Info className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Center Tabs - TikTok style */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-auto">
            <div className="flex items-center gap-1 p-1 rounded-full glass">
              <button
                onClick={() => setActiveView('feed')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeView === 'feed'
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Rss className="w-4 h-4" />
                <span className="hidden lg:inline">Feed</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('likes');
                  setLikedCount(getLikedArticles().length);
                  setLikedIndex(0);
                }}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeView === 'likes'
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden lg:inline">Likes</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('saved');
                  setSavedCount(getSavedArticles().length);
                  setSavedIndex(0);
                }}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeView === 'saved'
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden lg:inline">Saved</span>
              </button>
            </div>
          </div>
          
          {/* Right side - Feed button & Status */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            {/* Hide Read Toggle - Only show on feed view */}
            {activeView === 'feed' && !isLoading && articles.length > 0 && (
              <button
                onClick={handleToggleHideRead}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  hideRead 
                    ? 'glass border border-emerald-500/50 text-emerald-400' 
                    : 'glass border border-white/10 text-white/50 hover:text-white/70'
                }`}
                title={hideRead ? 'Showing unread only' : 'Showing all articles'}
              >
                {hideRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden lg:inline text-sm font-medium">
                  {hideRead ? 'Unread' : 'All'}
                </span>
              </button>
            )}

            {activeView === 'feed' && !isLoading && filteredArticles.length > 0 && (
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full glass">
                {isMultiFeed && sourceCount > 1 ? (
                  <>
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-white/70 text-sm font-medium">{sourceCount} feeds</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/70 text-sm font-medium">
                      {filteredArticles.length}{hideRead && articles.length !== filteredArticles.length ? `/${articles.length}` : ''} articles
                    </span>
                  </>
                )}
              </div>
            )}
            
            {/* Feed Button */}
            <button
              onClick={togglePanel}
              className="group flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl glass border border-[#ff6b35]/30 hover:bg-white/10 hover:border-[#ff6b35]/50 transition-all"
            >
              <Compass className="w-5 h-5 text-[#ff6b35]" />
              <span className="text-white/80 text-sm font-medium hidden lg:inline">Discover</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content based on active view */}
      {activeView === 'feed' ? (
        <>
          <CardStack
            articles={filteredArticles}
            currentIndex={currentIndex}
            onIndexChange={handleIndexChange}
            isLoading={isLoading}
            total={filteredArticles.length}
            onRefresh={refresh}
          />
          <ProgressIndicator current={currentIndex} total={filteredArticles.length} />
        </>
      ) : activeView === 'likes' ? (
        <>
          <LikedCardStack
            currentIndex={likedIndex}
            onIndexChange={setLikedIndex}
          />
          <ProgressIndicator current={likedIndex} total={likedCount} />
        </>
      ) : (
        <>
          <SavedCardStack
            currentIndex={savedIndex}
            onIndexChange={setSavedIndex}
          />
          <ProgressIndicator current={savedIndex} total={savedCount} />
        </>
      )}
      
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      
      <FeedPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        onFeedSelect={handleFeedSelect}
        isLoading={isLoading}
        selectedFeeds={selectedFeeds}
        onToggleFeed={handleToggleFeed}
        onClearSelection={handleClearSelection}
        onSelectAll={handleSelectAll}
      />
      
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
    </main>
  );
}
