'use client';

import useSWR from 'swr';

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch feed');
  }
  
  return data;
};

const multiFetcher = async (urls) => {
  const feedUrls = JSON.parse(urls);
  const results = await Promise.allSettled(
    feedUrls.map(url => fetcher(`/api/feed?url=${encodeURIComponent(url)}`))
  );
  
  const allArticles = [];
  const sources = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value?.articles) {
      allArticles.push(...result.value.articles);
      if (result.value.feedTitle) {
        sources.push(result.value.feedTitle);
      }
    }
  });
  
  if (allArticles.length === 0) {
    throw new Error('No articles found from any feed');
  }
  
  return {
    articles: shuffleArray(allArticles),
    feedTitle: sources.length > 1 ? `${sources.length} Mixed Feeds` : sources[0] || 'Mixed Feed',
    isMultiFeed: feedUrls.length > 1,
    sourceCount: sources.length,
  };
};

export function useFeed(feedUrl) {
  const isMultiFeed = Array.isArray(feedUrl);
  const cacheKey = isMultiFeed 
    ? JSON.stringify(feedUrl.sort()) 
    : feedUrl;
  
  const { data, error, isLoading, mutate } = useSWR(
    feedUrl 
      ? (isMultiFeed ? cacheKey : `/api/feed?url=${encodeURIComponent(feedUrl)}`)
      : null,
    isMultiFeed ? multiFetcher : fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000,
      errorRetryCount: 2,
    }
  );

  return {
    feed: data,
    articles: data?.articles || [],
    isLoading,
    error: error?.message || null,
    refresh: () => mutate(),
    isMultiFeed: data?.isMultiFeed || false,
    sourceCount: data?.sourceCount || 1,
  };
}
