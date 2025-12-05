'use client';

import { useEffect, useState } from 'react';
import { 
  Flame, Rocket, Gem, Zap, Rss, X, Sparkles, Link2, Clock, 
  Lightbulb, ArrowRight, Check, ChevronRight, Plus, Shuffle,
  Globe, Users, TrendingUp, Bookmark, Trash2, ExternalLink
} from 'lucide-react';
import FeedInput from './FeedInput';
import { getRecentFeeds, getSavedArticles, removeArticle } from '../lib/storage';

const EXAMPLE_FEEDS = [
  { 
    name: 'Hacker News', 
    url: 'https://hnrss.org/frontpage',
    Icon: Flame,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    description: 'Tech & Startups',
    readers: '2.4M'
  },
  { 
    name: 'Ars Technica', 
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    Icon: Rocket,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    description: 'Science & Tech',
    readers: '1.8M'
  },
  { 
    name: 'Reddit Tech', 
    url: 'https://www.reddit.com/r/technology/.rss',
    Icon: Gem,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    description: 'Community Picks',
    readers: '12M'
  },
  { 
    name: 'The Verge', 
    url: 'https://www.theverge.com/rss/index.xml',
    Icon: Zap,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    description: 'Tech Culture',
    readers: '5.2M'
  },
];

export default function FeedPanel({ isOpen, onClose, onFeedSelect, isLoading, selectedFeeds, onToggleFeed, onClearSelection, onSelectAll }) {
  const [recentFeeds, setRecentFeeds] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    if (isOpen) {
      setRecentFeeds(getRecentFeeds());
      setSavedArticles(getSavedArticles());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleRemoveSaved = (link, e) => {
    e.stopPropagation();
    removeArticle(link);
    setSavedArticles(getSavedArticles());
  };

  const toggleFeedSelection = (url) => {
    onToggleFeed(url);
  };

  const handleLoadFeeds = () => {
    if (selectedFeeds.length === 1) {
      onFeedSelect(selectedFeeds[0]);
    } else if (selectedFeeds.length > 1) {
      onFeedSelect(selectedFeeds);
    }
    // Keep selection so user sees which feeds are active
  };

  const handleSingleFeed = (url) => {
    onFeedSelect(url);
    setSelectedFeeds([]);
  };

  const isFeedSelected = (url) => selectedFeeds.includes(url);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] animate-fade-in"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6b35]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Panel - Centered modal for desktop, bottom sheet for mobile */}
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
        <div className="w-full sm:max-w-xl pointer-events-auto animate-slide-up">
          <div className="relative rounded-t-[2rem] sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Background layers */}
            <div className="absolute inset-0 bg-[#0d0d0f]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff6b35]/10 via-transparent to-transparent" />
            
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent" />
            
            {/* Content */}
            <div className="relative flex flex-col max-h-[90vh]">
              {/* Header - Fixed */}
              <div className="p-6 pb-4">
                {/* Handle */}
                <div className="flex justify-center mb-6 sm:hidden">
                  <div className="w-12 h-1.5 rounded-full bg-white/20" />
                </div>
                
                {/* Title row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] flex items-center justify-center shadow-lg shadow-[#ff6b35]/25">
                        <Rss className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-white text-xl font-bold tracking-tight">RSS-Tok</h2>
                        <p className="text-white/40 text-sm">Feed Discovery</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                {/* Tab navigation */}
                <div className="flex gap-1 mt-6 p-1 bg-white/5 rounded-2xl">
                  <button
                    onClick={() => setActiveTab('discover')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'discover'
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Discover</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'saved'
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved</span>
                    {savedArticles.length > 0 && (
                      <span className="bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full">
                        {savedArticles.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'custom'
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Custom</span>
                  </button>
                  {recentFeeds.length > 0 && (
                    <button
                      onClick={() => setActiveTab('recent')}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'recent'
                          ? 'bg-white/10 text-white shadow-lg'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">Recent</span>
                    </button>
                  )}
                </div>

                {/* Selection indicator */}
                {selectedFeeds.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-[#ff6b35]/10 border border-[#ff6b35]/20 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shuffle className="w-4 h-4 text-[#ff6b35]" />
                        <span className="text-white/80 text-sm">
                          <span className="font-semibold text-[#ff6b35]">{selectedFeeds.length}</span> feeds selected
                        </span>
                        <span className="text-white/40 text-xs">(will be mixed randomly)</span>
                      </div>
                      <button
                        onClick={handleLoadFeeds}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-lg bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#ff8c42] transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <span>Load</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
                {/* Discover Tab */}
                {activeTab === 'discover' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-white/40 text-sm">Tap to select, long press for single feed</p>
                      {selectedFeeds.length === 0 && (
                        <button
                          onClick={() => onSelectAll(EXAMPLE_FEEDS.map(f => f.url))}
                          className="text-[#ff6b35] text-xs font-medium hover:text-[#ff8c42] transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Select All
                        </button>
                      )}
                      {selectedFeeds.length > 0 && (
                        <button
                          onClick={onClearSelection}
                          className="text-white/40 text-xs font-medium hover:text-white/60 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {EXAMPLE_FEEDS.map((feed, index) => {
                      const isSelected = isFeedSelected(feed.url);
                      const Icon = feed.Icon;
                      return (
                        <button
                          key={feed.url}
                          onClick={() => toggleFeedSelection(feed.url)}
                          onDoubleClick={() => handleSingleFeed(feed.url)}
                          disabled={isLoading}
                          className={`group relative w-full p-4 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 overflow-hidden ${
                            isSelected 
                              ? 'bg-[#ff6b35]/10 border-[#ff6b35]/40' 
                              : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Hover glow */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${feed.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300`} />
                          
                          <div className="relative flex items-center gap-4">
                            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feed.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff6b35] flex items-center justify-center shadow-lg">
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-semibold text-lg">{feed.name}</p>
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {feed.readers}
                                </span>
                              </div>
                              <p className="text-white/40 text-sm mt-0.5">{feed.description}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              isSelected 
                                ? 'bg-[#ff6b35] text-white' 
                                : 'bg-white/5 text-white/40 group-hover:bg-[#ff6b35] group-hover:text-white'
                            }`}>
                              {isSelected ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Plus className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Saved Articles Tab */}
                {activeTab === 'saved' && (
                  <div className="animate-fade-in">
                    {savedArticles.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                          <Bookmark className="w-8 h-8 text-amber-500/50" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">No saved articles</h3>
                        <p className="text-white/40 text-sm max-w-xs mx-auto">
                          Tap the bookmark icon on any article to save it for later
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-white/40 text-sm mb-4">
                          {savedArticles.length} saved article{savedArticles.length !== 1 ? 's' : ''}
                        </p>
                        {savedArticles.map((article, index) => (
                          <div
                            key={article.link}
                            className="group relative p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex gap-3">
                              {/* Thumbnail */}
                              {article.image && (
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                  <img 
                                    src={article.image} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-sm line-clamp-2 mb-1 group-hover:text-[#ff6b35] transition-colors">
                                  {article.title}
                                </h4>
                                <p className="text-white/40 text-xs mb-2">{article.source}</p>
                                
                                <div className="flex items-center gap-2">
                                  <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-[#ff6b35] hover:text-[#ff8c42] transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Open
                                  </a>
                                  <button
                                    onClick={(e) => handleRemoveSaved(article.link, e)}
                                    className="flex items-center gap-1 text-xs text-white/40 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom URL Tab */}
                {activeTab === 'custom' && (
                  <div className="animate-fade-in">
                    <div className="mb-6">
                      <p className="text-white/40 text-sm mb-4">Enter any RSS feed URL to transform it or add to mix</p>
                      <FeedInput 
                        onSubmit={handleSingleFeed} 
                        onAddToMix={toggleFeedSelection}
                        isLoading={isLoading} 
                        hasSelection={selectedFeeds.length > 0}
                      />
                    </div>

                    {/* Custom URLs in selection */}
                    {selectedFeeds.filter(url => !EXAMPLE_FEEDS.some(f => f.url === url)).length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Custom URLs in mix</p>
                        {selectedFeeds
                          .filter(url => !EXAMPLE_FEEDS.some(f => f.url === url))
                          .map(url => (
                            <div 
                              key={url}
                              className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Link2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="flex-1 text-white/70 text-sm truncate">{url}</span>
                              <button
                                onClick={() => toggleFeedSelection(url)}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                <X className="w-4 h-4 text-white/40 hover:text-white/60" />
                              </button>
                            </div>
                          ))
                        }
                      </div>
                    )}
                    
                    {/* Tips */}
                    <div className="p-4 rounded-2xl bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium mb-1">Pro tip</p>
                          <p className="text-white/50 text-xs leading-relaxed">
                            Most websites have RSS feeds! Try adding <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#ff6b35]">/rss</code> or <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#ff6b35]">/feed</code> to any URL.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Multiple feeds info */}
                    <div className="mt-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-start gap-3">
                        <Shuffle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium mb-1">Multi-feed mode</p>
                          <p className="text-white/50 text-xs leading-relaxed">
                            Click <span className="text-purple-400 font-medium">"Add to Mix"</span> to add this URL to your feed mix, or select feeds from Discover tab!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Tab */}
                {activeTab === 'recent' && recentFeeds.length > 0 && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-white/40 text-sm">Your recently viewed feeds</p>
                      {recentFeeds.length > 1 && (
                        <button
                          onClick={() => {
                            const allRecent = recentFeeds.filter(url => !selectedFeeds.includes(url));
                            onSelectAll([...selectedFeeds, ...allRecent]);
                          }}
                          className="text-[#ff6b35] text-xs font-medium hover:text-[#ff8c42] transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add All to Mix
                        </button>
                      )}
                    </div>
                    {recentFeeds.map((url, index) => {
                      const isSelected = isFeedSelected(url);
                      return (
                        <button
                          key={url}
                          onClick={() => toggleFeedSelection(url)}
                          onDoubleClick={() => handleSingleFeed(url)}
                          disabled={isLoading}
                          className={`group w-full p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] disabled:opacity-50 ${
                            isSelected 
                              ? 'bg-[#ff6b35]/10 border-[#ff6b35]/40' 
                              : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              isSelected ? 'bg-[#ff6b35]' : 'bg-white/5'
                            }`}>
                              {isSelected ? (
                                <Check className="w-5 h-5 text-white" />
                              ) : (
                                <Globe className="w-5 h-5 text-white/40" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate transition-colors ${
                                isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                              }`}>{url}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
                  <TrendingUp className="w-4 h-4" />
                  <span>RSS Resurrected • Built for the open web</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
