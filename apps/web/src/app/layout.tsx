import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AVOS Enterprise',
    template: '%s | AVOS Enterprise',
  },
  description:
    'The Operating System for Mobility — منصة مؤسسية ذكية للتنقل والثقة والإنتاج الرقمي.',
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