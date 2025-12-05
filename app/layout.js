import './globals.css';

export const metadata = {
  title: 'RSS-Tok - Modern RSS Feed Experience',
  description: 'Transform boring RSS feeds into a TikTok-style visual experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
