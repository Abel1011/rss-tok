import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80';
const MAX_ARTICLES = 15;

function extractImage(item) {
  if (item.mediaContent?.[0]?.$.url) {
    return item.mediaContent[0].$.url;
  }
  
  if (item.mediaThumbnail?.$.url) {
    return item.mediaThumbnail.$.url;
  }
  
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }
  
  const content = item.contentEncoded || item.content || item['content:encoded'] || item.description || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) {
    return imgMatch[1];
  }
  
  return null;
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim().slice(0, 300);
}

function extractFullContent(item) {
  // Try to get the full content from various fields
  const rawContent = item.contentEncoded || item.content || item['content:encoded'] || item.description || '';
  
  if (!rawContent) return null;
  
  // Clean up HTML but preserve structure
  let content = rawContent
    // Remove scripts and styles
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Convert common elements to readable format
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/blockquote>/gi, '\n\n')
    .replace(/<blockquote>/gi, '\n❝ ')
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Clean up whitespace
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  // Only return if there's substantial content (more than just the description)
  if (content.length > 350) {
    return content;
  }
  
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('url');

  if (!feedUrl) {
    return Response.json({ error: 'URL parameter is required' }, { status: 400 });
  }


  try {
    const feed = await parser.parseURL(feedUrl);
    
    const articles = feed.items.slice(0, MAX_ARTICLES).map((item, index) => ({
      id: `${Date.now()}-${index}`,
      title: item.title || 'Untitled',
      description: stripHtml(item.contentSnippet || item.description || item.content),
      fullContent: extractFullContent(item),
      hasFullContent: !!extractFullContent(item),
      link: item.link || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      image: extractImage(item) || DEFAULT_IMAGE,
      source: feed.title || 'Unknown Source',
    }));

    return Response.json({
      title: feed.title,
      articles,
      fetchedAt: Date.now(),
    });
  } catch (error) {
    console.error('Feed parsing error:', error);
    return Response.json(
      { error: 'Failed to fetch or parse the RSS feed. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}
