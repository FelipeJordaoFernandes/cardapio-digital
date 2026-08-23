import type { MetadataRoute } from 'next';
import { storeConfig } from './config/store';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${storeConfig.name} — Cardápio digital`,
    short_name: storeConfig.name,
    description: storeConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fffaf6',
    theme_color: '#e74423',
    lang: 'pt-BR',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
