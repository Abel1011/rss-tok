# Project Structure

## Directory Organization

```
app/
├── api/feed/          # API routes for RSS parsing
├── components/        # React components (all client-side)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── layout.js          # Root layout
├── page.js            # Main page component
└── globals.css        # Global styles
```

## Component Organization

### Main Components
- `CardStack.jsx` - Main feed view with vertical scrolling
- `SavedCardStack.jsx` - Saved articles view
- `LikedCardStack.jsx` - Liked articles view
- `ArticleCard.jsx` - Individual article card
- `FeedPanel.jsx` - Feed discovery/selection modal
- `StatsModal.jsx` - Reading statistics
- `InfoModal.jsx` - About/info modal

### UI Components
- `FeedButton.jsx` - Feed selection button
- `FeedInput.jsx` - Custom feed URL input
- `ProgressIndicator.jsx` - Article progress bar
- `SkeletonCard.jsx` - Loading skeleton
- `ThemeToggle.jsx` - Theme switcher

## Hooks Pattern

Custom hooks encapsulate specific logic:
- `useAppState.js` - Global app state (index, panel, feed URL)
- `useFeed.js` - RSS feed fetching with SWR
- `useTheme.js` - Theme management

## Lib Utilities

- `storage.js` - localStorage wrapper functions (recent feeds, saved/liked articles, read tracking, theme)
- `validation.js` - URL validation for RSS feeds

## Naming Conventions

- Components: PascalCase with `.jsx` extension
- Hooks: camelCase with `use` prefix, `.js` extension
- Utilities: camelCase, `.js` extension
- All client components must have `'use client'` directive at top

## State Management Pattern

State flows from `page.js` down through props. Custom hooks manage specific domains (feed data, app state, theme). localStorage handles persistence.
