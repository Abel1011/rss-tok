const RECENT_FEEDS_KEY = 'rss-tok-recent-feeds';
const THEME_KEY = 'rss-tok-theme';
const SAVED_ARTICLES_KEY = 'rss-tok-saved-articles';
const LIKED_ARTICLES_KEY = 'rss-tok-liked-articles';
const READ_ARTICLES_KEY = 'rss-tok-read-articles';
const HIDE_READ_KEY = 'rss-tok-hide-read';
const MAX_RECENT_FEEDS = 5;
const MAX_SAVED_ARTICLES = 50;
const MAX_LIKED_ARTICLES = 100;
const MAX_READ_ARTICLES = 500;

export function getRecentFeeds() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENT_FEEDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentFeed(url) {
  if (typeof window === 'undefined') return;
  
  try {
    let feeds = getRecentFeeds();
    feeds = feeds.filter(f => f !== url);
    feeds.unshift(url);
    feeds = feeds.slice(0, MAX_RECENT_FEEDS);
    localStorage.setItem(RECENT_FEEDS_KEY, JSON.stringify(feeds));
  } catch {
    // Silent fail
  }
}

export function getTheme() {
  if (typeof window === 'undefined') return 'dark';
  
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

export function setTheme(theme) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Silent fail
  }
}

// Saved Articles functions
export function getSavedArticles() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SAVED_ARTICLES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveArticle(article) {
  if (typeof window === 'undefined') return;
  
  try {
    let articles = getSavedArticles();
    // Check if already saved (by link)
    if (articles.some(a => a.link === article.link)) return;
    
    // Add with timestamp
    const articleToSave = {
      ...article,
      savedAt: Date.now(),
    };
    articles.unshift(articleToSave);
    articles = articles.slice(0, MAX_SAVED_ARTICLES);
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(articles));
  } catch {
    // Silent fail
  }
}

export function removeArticle(link) {
  if (typeof window === 'undefined') return;
  
  try {
    let articles = getSavedArticles();
    articles = articles.filter(a => a.link !== link);
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(articles));
  } catch {
    // Silent fail
  }
}

export function isArticleSaved(link) {
  if (typeof window === 'undefined') return false;
  
  try {
    const articles = getSavedArticles();
    return articles.some(a => a.link === link);
  } catch {
    return false;
  }
}

// Liked Articles functions
export function getLikedArticles() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function likeArticle(article) {
  if (typeof window === 'undefined') return;
  
  try {
    let articles = getLikedArticles();
    // Check if already liked (by link)
    if (articles.some(a => a.link === article.link)) return;
    
    // Add with timestamp
    const articleToLike = {
      ...article,
      likedAt: Date.now(),
    };
    articles.unshift(articleToLike);
    articles = articles.slice(0, MAX_LIKED_ARTICLES);
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(articles));
  } catch {
    // Silent fail
  }
}

export function unlikeArticle(link) {
  if (typeof window === 'undefined') return;
  
  try {
    let articles = getLikedArticles();
    articles = articles.filter(a => a.link !== link);
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(articles));
  } catch {
    // Silent fail
  }
}

export function isArticleLiked(link) {
  if (typeof window === 'undefined') return false;
  
  try {
    const articles = getLikedArticles();
    return articles.some(a => a.link === link);
  } catch {
    return false;
  }
}

// Read Articles functions
export function getReadArticles() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(READ_ARTICLES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function markAsRead(link) {
  if (typeof window === 'undefined') return;
  
  try {
    let readArticles = getReadArticles();
    // Check if already read
    if (readArticles.includes(link)) return;
    
    readArticles.unshift(link);
    readArticles = readArticles.slice(0, MAX_READ_ARTICLES);
    localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify(readArticles));
  } catch {
    // Silent fail
  }
}

export function isArticleRead(link) {
  if (typeof window === 'undefined') return false;
  
  try {
    const readArticles = getReadArticles();
    return readArticles.includes(link);
  } catch {
    return false;
  }
}

export function clearReadArticles() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(READ_ARTICLES_KEY);
  } catch {
    // Silent fail
  }
}

// Hide read preference
export function getHideReadPreference() {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(HIDE_READ_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setHideReadPreference(hide) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(HIDE_READ_KEY, hide ? 'true' : 'false');
  } catch {
    // Silent fail
  }
}

