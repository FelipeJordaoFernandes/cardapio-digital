import type { MetadataRoute } from 'next';
import { storeConfig } from './config/store';
import { categories } from './data/menu';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: storeConfig.siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...categories.map((category) => ({
      url: `${storeConfig.siteUrl}/categoria/${category.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
