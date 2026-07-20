import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://avos.example';

  return [
    '',
    '/about',
    '/platforms',
    '/technology',
    '/trust',
    '/contact',
    '/marketplace',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));
}