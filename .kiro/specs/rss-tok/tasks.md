# Implementation Plan

- [x] 1. Set up project infrastructure
  - Install dependencies: rss-parser, swr, lucide-react
  - Set up project folder structure for components, hooks, lib, and api
  - Configure Next.js 15 with App Router
  - _Requirements: 3.1_

- [x] 2. Implement core utility functions

  - [x] 2.1 Create URL validation utility
    - Implement validateUrl function that checks for valid HTTP/HTTPS URLs
    - _Requirements: 2.2_

  - [x] 2.2 Create storage utilities for localStorage
    - Implement getRecentFeeds, addRecentFeed functions with max 5 limit
    - Implement getTheme, setTheme functions
    - Implement getSavedArticles, saveArticle, removeArticle, isArticleSaved
    - Implement getLikedArticles, likeArticle, unlikeArticle, isArticleLiked
    - Implement getReadArticles, markAsRead, isArticleRead, clearReadArticles
    - Implement getHideReadPreference, setHideReadPreference
    - _Requirements: 2.4, 2.5, 6.2, 7.3, 7.7, 10.7_

- [x] 3. Implement RSS feed processing

  - [x] 3.1 Create API route for RSS feed fetching
    - Implement /api/feed route to fetch and parse RSS feeds server-side
    - Use rss-parser library with custom fields for media content
    - Extract title, description, full content, link, pubDate, image from each item
    - Implement extractImage function to get images from multiple sources
    - Implement extractFullContent function to get full article text
    - Limit results to maximum 15 articles
    - Apply default Unsplash placeholder image when article lacks image
    - Handle network errors and return appropriate error responses
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 3.2 Create useFeed hook with SWR
    - Use SWR for data fetching with automatic caching (1 hour deduplication)
    - Implement single feed fetcher
    - Implement multi-feed fetcher with Promise.allSettled
    - Shuffle articles from multiple feeds using Fisher-Yates algorithm
    - Handle loading states and error handling
    - _Requirements: 2.8, 3.8, 11.2, 11.3, 11.4_

- [x] 4. Implement app state management

  - [x] 4.1 Create useAppState hook for UI state
    - Manage currentIndex, isPanelOpen, currentFeedUrl (string or array)
    - Implement navigation functions (next, prev, goToIndex)
    - Implement panel toggle and close functions
    - Implement changeFeed function supporting single or multiple URLs
    - Track isMultiFeed state
    - _Requirements: 1.1, 1.2, 2.8, 4.4_

  - [x] 4.2 Create useTheme hook for theme management
    - Manage theme state (dark/light) with localStorage persistence
    - Implement toggle function
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 5. Implement UI components - Cards and Stack

  - [x] 5.1 Create ArticleCard component
    - Desktop: Split layout with content on left, image on right
    - Mobile: Full-screen image with gradient overlay and content at bottom
    - Title with line clamping, bold typography
    - Full content reading capability with expand/collapse
    - Source, date, and full content badge metadata
    - "Read Here" button for articles with full content
    - "Open Original" button opening link in new tab
    - Share button with native share API fallback
    - Like button with double-tap gesture support
    - Save button for bookmarking articles
    - Heart animation on double-tap
    - Entry animations (fade + slide up + Ken Burns effect)
    - Responsive design for mobile and desktop
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.2 Create SkeletonCard component
    - Placeholder UI matching ArticleCard layout
    - Animated pulse effect
    - _Requirements: 3.6_

  - [x] 5.3 Create CardStack component
    - Vertical scroll container with scroll-snap-type: y mandatory
    - Handle scroll events to update current index
    - Keyboard navigation (up/down arrows, J/K keys)
    - Render ArticleCard for each article
    - Show SkeletonCard during loading
    - Mark articles as read on navigation
    - Refresh functionality
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 7.6, 9.2_

  - [x] 5.4 Create SavedCardStack component
    - Vertical scroll container for saved articles
    - Load saved articles from localStorage
    - Handle empty state
    - _Requirements: 10.2_

  - [x] 5.5 Create LikedCardStack component
    - Vertical scroll container for liked articles
    - Load liked articles from localStorage
    - Handle empty state
    - _Requirements: 10.1_

  - [x] 5.6 Create ProgressIndicator component
    - Display current position as "X/Y" format
    - Position fixed on screen
    - _Requirements: 4.5_

- [x] 6. Implement UI components - Feed Panel and Input

  - [x] 6.1 Create FeedInput component
    - Text input with placeholder
    - "Transform" button for single feed
    - "Add to Mix" button for multi-feed selection
    - Loading state
    - Support for both single and multi-feed modes
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 6.2 Create FeedPanel component
    - Slide-in modal panel with tabs
    - Discover tab with example feeds (Hacker News, Ars Technica, Reddit Technology, The Verge)
    - Saved tab showing saved articles with thumbnails
    - Custom tab with FeedInput and tips
    - Recent tab showing recent feeds history
    - Multi-feed selection with checkboxes
    - Selection indicator showing feed count
    - "Load" button for multi-feed
    - "Select All" and "Clear" buttons
    - Remove saved articles functionality
    - Close button and backdrop
    - _Requirements: 1.4, 2.1, 2.6, 2.7, 2.8_

  - [x] 6.3 Create FeedButton component
    - Discover button in header
    - _Requirements: 1.3_

- [x] 7. Implement UI components - Modals and Settings

  - [x] 7.1 Create ThemeToggle component
    - Toggle button switching dark/light modes
    - _Requirements: 6.1_

  - [x] 7.2 Create InfoModal component
    - About RSS-Tok information
    - Explanation of RSS and project goals
    - Feature highlights (no algorithms, no tracking, modern UX)
    - Hackathon badge
    - _Requirements: N/A (Additional feature)_

  - [x] 7.3 Create StatsModal component
    - Statistics modal with tabs (Overview, Activity, Sources)
    - Overview: Total read, liked, saved, sources counts
    - Engagement and save rate progress bars
    - Activity: Time-based stats (today, this week, this month)
    - Sources: Top 5 most engaged sources
    - Calculate statistics from localStorage data
    - _Requirements: 10.4, 10.5_

- [x] 8. Integrate all components in main page

  - [x] 8.1 Update app layout
    - Set up root layout with metadata
    - Apply global styles
    - _Requirements: 6.3_

  - [x] 8.2 Update main page component
    - Load default feed (Reddit Technology) on mount
    - Implement view management (Feed, Likes, Saved tabs)
    - Render CardStack, SavedCardStack, or LikedCardStack based on active view
    - Render ProgressIndicator, FeedPanel, ThemeToggle, InfoModal, StatsModal
    - Handle loading and error states with styled error page
    - Implement hide read filter toggle
    - Filter articles based on read status
    - Track read articles on navigation
    - Handle multi-feed selection state
    - _Requirements: 1.1, 1.2, 1.4, 10.1, 10.2, 10.3, 10.4, 10.6, 10.7_

  - [x] 8.3 Implement global styles
    - Dark theme CSS variables and gradients
    - Glassmorphism effects for overlays
    - Custom animations (fade-in, slide-up, scale-in, heart-pop)
    - Gradient overlays and noise textures
    - Button styles (btn-primary, btn-secondary)
    - Smooth transitions
    - Responsive breakpoints
    - Scrollbar hiding utilities
    - _Requirements: 9.1, 9.3_

- [x] 9. Implement header and navigation

  - [x] 9.1 Create header component
    - Logo with gradient background
    - Stats button
    - Info button
    - Center tabs for view switching (Feed, Likes, Saved)
    - Hide read toggle button
    - Feed status indicator (article count or multi-feed count)
    - Discover button
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6_

- [x] 10. Performance optimizations

  - [x] 10.1 Implement lazy loading for images
    - Use native lazy loading attribute on images
    - _Requirements: 11.1_

  - [x] 10.2 Implement SWR caching
    - Configure SWR with 1-hour deduplication interval
    - Disable revalidation on focus
    - Set error retry count to 2
    - _Requirements: 11.2, 11.3_

  - [x] 10.3 Implement parallel feed fetching
    - Use Promise.allSettled for multi-feed requests
    - Handle partial failures gracefully
    - _Requirements: 11.4_

- [x] 11. Testing and polish

  - [x] 11.1 Test responsive design
    - Verify mobile and desktop layouts
    - Test touch gestures (double-tap to like)
    - Test keyboard navigation
    - _Requirements: 9.1, 9.2_

  - [x] 11.2 Test error handling
    - Verify error states display correctly
    - Test network failures
    - Test invalid feed URLs
    - Test empty feeds
    - _Requirements: 3.7, 8.3_

  - [x] 11.3 Test localStorage functionality
    - Verify recent feeds storage
    - Verify theme persistence
    - Verify saved articles persistence
    - Verify liked articles persistence
    - Verify read articles tracking
    - Verify hide read preference
    - _Requirements: 2.4, 2.5, 6.2, 7.7, 10.7_

  - [x] 11.4 Polish animations and transitions
    - Verify all entry animations
    - Test scroll snap behavior
    - Test modal animations
    - Test heart animation on double-tap
    - _Requirements: 5.8, 7.2_
