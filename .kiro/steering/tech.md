# Tech Stack

## Framework & Libraries

- **Next.js 16** (App Router) - React framework with server/client components
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first styling
- **SWR** - Data fetching with caching and revalidation
- **rss-parser** - RSS feed parsing
- **lucide-react** - Icon library

## Build System

- **Package Manager**: npm (package-lock.json present)
- **Node.js**: 18+ required

## Common Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture Patterns

### Client-Side Only
All components use `'use client'` directive - this is a fully client-side application with no SSR.

### Data Fetching
- API routes in `app/api/` handle RSS parsing server-side
- SWR for client-side caching with 1-hour deduplication
- localStorage for persistence (saved articles, likes, read status, theme)

### State Management
- Custom hooks for state logic (`useAppState`, `useFeed`, `useTheme`)
- No external state management library
- localStorage utilities in `app/lib/storage.js`

### Styling Conventions
- Tailwind utility classes
- Custom CSS classes: `glass`, `btn-primary`
- Glassmorphism effects with `bg-white/[0.03]` opacity patterns
- Gradient colors: `from-[#ff6b35] to-[#ff8c42]` (brand orange)
- Dark theme: `bg-[#0a0a0b]` base color
