# 📡 RSS-Tok: Feed Resurrected

> **🎃 Kiroween Hackathon 2025 - Resurrection Category**  
> Bringing RSS back from the dead with modern TikTok-style UX

![RSS-Tok Banner](https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80)

## 🧟 The Resurrection Story

RSS (Really Simple Syndication) was the backbone of the open web in the 2000s. It let you subscribe to any website and get updates without algorithms deciding what you see. When Google Reader shut down in 2013, RSS faded from mainstream use—but it never died.

**RSS-Tok** resurrects this "dead" technology by transforming traditional RSS feeds into a modern, TikTok-style vertical scrolling experience. No algorithms. No tracking. Just pure, open web content in a format that feels native to 2025.

## ✨ Features

### 🎯 Core Experience
- **TikTok-Style Feed**: Vertical scrolling with snap-to-card navigation
- **Full Article Reading**: Read complete articles inline without leaving the app
- **Multi-Feed Mixing**: Select multiple RSS feeds and mix them into a single randomized stream
- **Smart Caching**: SWR-powered caching with 1-hour deduplication

### 💾 Content Management
- **Like Articles**: Double-tap or click to like articles (with heart animation!)
- **Save for Later**: Bookmark articles to read later
- **Read Tracking**: Mark articles as read and filter them out
- **Statistics Dashboard**: Track your reading habits, engagement rates, and favorite sources

### 🎨 Modern UX
- **Responsive Design**: Split layout on desktop, full-screen on mobile
- **Dark Theme**: Beautiful dark mode with glassmorphism effects
- **Smooth Animations**: Ken Burns effects, fade transitions, and micro-interactions
- **Keyboard Navigation**: Arrow keys and J/K shortcuts for power users

### 🔍 Feed Discovery
- **Curated Examples**: Hacker News, Ars Technica, Reddit Technology, The Verge
- **Custom URLs**: Add any RSS feed URL
- **Recent History**: Quick access to your last 5 feeds
- **Saved Articles View**: Browse your bookmarked content

## 🎃 Built for Kiroween

This project was created for the **Kiroween Hackathon 2025** in the **Resurrection** category, showcasing how Kiro's AI-powered IDE can help bring dead technology back to life.

### Kiro Features Used:
- **Spec-Driven Development**: Structured requirements, design, and task management
- **Natural Conversation**: Iterative development through chat
- **Code Generation**: Rapid component scaffolding and implementation
- **File Management**: Efficient multi-file editing and refactoring

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd rss-tok

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Data Fetching**: SWR for caching and revalidation
- **RSS Parsing**: rss-parser
- **Icons**: lucide-react
- **Storage**: localStorage for persistence

## 📁 Project Structure

```
rss-tok/
├── app/
│   ├── api/feed/          # RSS feed parsing API route
│   ├── components/        # React components
│   │   ├── ArticleCard.jsx
│   │   ├── CardStack.jsx
│   │   ├── FeedPanel.jsx
│   │   ├── StatsModal.jsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useAppState.js
│   │   ├── useFeed.js
│   │   └── useTheme.js
│   ├── lib/               # Utility functions
│   │   ├── storage.js
│   │   └── validation.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── .kiro/specs/rss-tok/   # Spec documentation
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
└── public/
```

## 🎮 Usage

### Basic Navigation
- **Scroll** or use **arrow keys** to navigate between articles
- **Double-tap** an article to like it
- Click **Like**, **Save**, or **Share** buttons on each card
- Press **Read Here** to expand full article content inline

### Feed Management
1. Click the **Discover** button in the header
2. Choose from **Discover**, **Saved**, **Custom**, or **Recent** tabs
3. Select multiple feeds to mix them together
4. Click **Load** to fetch and randomize articles

### View Switching
- **Feed**: Main RSS feed view
- **Likes**: All your liked articles
- **Saved**: All your bookmarked articles

### Statistics
- Click the **stats icon** to view your reading analytics
- See engagement rates, time-based activity, and top sources

## 🌐 Why RSS Still Matters

In an era of algorithmic feeds and walled gardens, RSS represents:
- **User Control**: You choose what you see
- **Privacy**: No tracking or data collection
- **Open Web**: Works with any website that publishes RSS
- **No Vendor Lock-in**: Your subscriptions aren't tied to a platform

RSS-Tok proves that "dead" technology can be resurrected with modern UX design, making the open web accessible and engaging for a new generation.

## 🎨 Design Philosophy

- **No Algorithms**: You control your feed, not an AI
- **No Tracking**: Your reading habits stay private
- **Modern UX**: TikTok-style interface meets open web values
- **Performance First**: Lazy loading, caching, and optimized rendering

## 📝 License

MIT License - feel free to use this project as inspiration for your own RSS reader!

## 🙏 Acknowledgments

- Built with [Kiro IDE](https://kiro.ai) for the Kiroween Hackathon 2025
- Inspired by the golden age of RSS and Google Reader
- Default images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)

## 🔮 Future Ideas

- [ ] Podcast support (audio RSS feeds)
- [ ] Export/import OPML feed lists
- [ ] Offline reading mode with service workers
- [ ] Text-to-speech for articles
- [ ] Custom themes and color schemes
- [ ] Social features (share reading lists)

---

**Made with 💀 for Kiroween 2025**  
*Resurrecting the open web, one feed at a time.*
