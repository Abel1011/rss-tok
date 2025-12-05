'use client';

import { useState, useEffect } from 'react';
import { X, TrendingUp, Heart, Bookmark, Eye, Rss, Calendar, BarChart3, Clock, Zap } from 'lucide-react';
import { getSavedArticles, getLikedArticles, getReadArticles, getRecentFeeds } from '../lib/storage';

export default function StatsModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      calculateStats();
    }
  }, [isOpen]);

  const calculateStats = () => {
    const savedArticles = getSavedArticles();
    const likedArticles = getLikedArticles();
    const readArticles = getReadArticles();
    const recentFeeds = getRecentFeeds();

    // Calculate time-based stats
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    // Saved articles by time
    const savedToday = savedArticles.filter(a => a.savedAt && (now - a.savedAt) < oneDay).length;
    const savedThisWeek = savedArticles.filter(a => a.savedAt && (now - a.savedAt) < oneWeek).length;
    const savedThisMonth = savedArticles.filter(a => a.savedAt && (now - a.savedAt) < oneMonth).length;

    // Liked articles by time
    const likedToday = likedArticles.filter(a => a.likedAt && (now - a.likedAt) < oneDay).length;
    const likedThisWeek = likedArticles.filter(a => a.likedAt && (now - a.likedAt) < oneWeek).length;
    const likedThisMonth = likedArticles.filter(a => a.likedAt && (now - a.likedAt) < oneMonth).length;

    // Get unique sources from saved and liked
    const allSources = new Set();
    savedArticles.forEach(a => a.source && allSources.add(a.source));
    likedArticles.forEach(a => a.source && allSources.add(a.source));

    // Most liked/saved sources
    const sourceStats = {};
    [...savedArticles, ...likedArticles].forEach(a => {
      if (a.source) {
        sourceStats[a.source] = (sourceStats[a.source] || 0) + 1;
      }
    });
    const topSources = Object.entries(sourceStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Calculate engagement rate (liked / read)
    const engagementRate = readArticles.length > 0 
      ? Math.round((likedArticles.length / readArticles.length) * 100) 
      : 0;

    // Save rate (saved / read)
    const saveRate = readArticles.length > 0 
      ? Math.round((savedArticles.length / readArticles.length) * 100) 
      : 0;

    setStats({
      // Totals
      totalRead: readArticles.length,
      totalLiked: likedArticles.length,
      totalSaved: savedArticles.length,
      totalFeeds: recentFeeds.length,
      uniqueSources: allSources.size,

      // Time-based
      savedToday,
      savedThisWeek,
      savedThisMonth,
      likedToday,
      likedThisWeek,
      likedThisMonth,

      // Sources
      topSources,

      // Rates
      engagementRate,
      saveRate,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-3xl bg-[#141416] border border-white/10 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Statistics</h2>
              <p className="text-white/40 text-sm">Your reading activity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-white text-black' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'activity' 
                ? 'bg-white text-black' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'sources' 
                ? 'bg-white text-black' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Sources
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {!stats ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={<Eye className="w-5 h-5" />}
                  label="Articles Read"
                  value={stats.totalRead}
                  color="from-blue-500 to-cyan-500"
                />
                <StatCard
                  icon={<Heart className="w-5 h-5" />}
                  label="Liked"
                  value={stats.totalLiked}
                  color="from-red-500 to-pink-500"
                />
                <StatCard
                  icon={<Bookmark className="w-5 h-5" />}
                  label="Saved"
                  value={stats.totalSaved}
                  color="from-amber-500 to-orange-500"
                />
                <StatCard
                  icon={<Rss className="w-5 h-5" />}
                  label="Sources"
                  value={stats.uniqueSources}
                  color="from-emerald-500 to-teal-500"
                />
              </div>

              {/* Engagement Rates */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white/60 text-sm font-medium mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Engagement
                </h3>
                <div className="space-y-4">
                  <ProgressBar
                    label="Like Rate"
                    value={stats.engagementRate}
                    color="from-red-500 to-pink-500"
                  />
                  <ProgressBar
                    label="Save Rate"
                    value={stats.saveRate}
                    color="from-amber-500 to-orange-500"
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'activity' ? (
            <div className="space-y-6">
              {/* Likes Activity */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white/60 text-sm font-medium mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  Likes Activity
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <TimeStatCard label="Today" value={stats.likedToday} />
                  <TimeStatCard label="This Week" value={stats.likedThisWeek} />
                  <TimeStatCard label="This Month" value={stats.likedThisMonth} />
                </div>
              </div>

              {/* Saved Activity */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white/60 text-sm font-medium mb-4 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  Saved Activity
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <TimeStatCard label="Today" value={stats.savedToday} />
                  <TimeStatCard label="This Week" value={stats.savedThisWeek} />
                  <TimeStatCard label="This Month" value={stats.savedThisMonth} />
                </div>
              </div>

              {/* Reading Streak Placeholder */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{stats.totalRead} articles</p>
                    <p className="text-white/60 text-sm">Total reading journey</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.topSources.length > 0 ? (
                <>
                  <p className="text-white/40 text-sm">Your most engaged sources</p>
                  {stats.topSources.map(([source, count], index) => (
                    <div 
                      key={source}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                        'bg-white/10'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{source}</p>
                        <p className="text-white/40 text-sm">{count} interactions</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Rss className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40">No source data yet</p>
                  <p className="text-white/20 text-sm mt-1">Start reading to see your favorite sources</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-white font-bold text-2xl">{value}</p>
      <p className="text-white/40 text-sm">{label}</p>
    </div>
  );
}

function TimeStatCard({ label, value }) {
  return (
    <div className="text-center p-3 rounded-xl bg-white/5">
      <p className="text-white font-bold text-xl">{value}</p>
      <p className="text-white/40 text-xs">{label}</p>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-white/60 text-sm">{label}</span>
        <span className="text-white font-medium text-sm">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
