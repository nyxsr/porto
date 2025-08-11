import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import './globals.css';

import { SITE, TITLE } from '@/constants/seo';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: TITLE.HOME,
  description: SITE.DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${ibmPlexSans.className} antialiased`}>{children}</body>
    </html>
  );
}
