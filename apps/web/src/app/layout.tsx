import "./enterprise-runtime/ueap.css";
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AVOS Enterprise',
    template: '%s | AVOS Enterprise',
  },
  description:
    'The Operating System for Mobility â€” Ù…Ù†ØµØ© Ù…Ø¤Ø³Ø³ÙŠØ© Ø°ÙƒÙŠØ© Ù„Ù„ØªÙ†Ù‚Ù„ ÙˆØ§Ù„Ø«Ù‚Ø© ÙˆØ§Ù„Ø¥Ù†ØªØ§Ø¬ Ø§Ù„Ø±Ù‚Ù…ÙŠ.',
  keywords: [
    'AVOS',
    'Mobility',
    'Artificial Intelligence',
    'Marketplace',
    'Enterprise Platform',
  ],
  openGraph: {
    title: 'AVOS Enterprise',
    description: 'The Operating System for Mobility',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="ar">
      <body>{children}</body>
    </html>
  );
}
