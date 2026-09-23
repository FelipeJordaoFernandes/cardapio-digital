import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { storeConfig } from './src/config/store.js';
import { categories } from './src/data/menu.js';

const pages = [
  ...categories.map((category) => ({
    path: `/categoria/${category.slug}`,
    title: `${category.name} | ${storeConfig.name}`,
    description: `${category.description}. Veja as opções e monte seu pedido online.`,
    index: true,
  })),
  {
    path: '/carrinho',
    title: `Carrinho | ${storeConfig.name}`,
    description: 'Revise os produtos adicionados ao seu pedido.',
    index: false,
  },
  {
    path: '/finalizar',
    title: `Dados para entrega | ${storeConfig.name}`,
    description: 'Informe os dados de entrega e a forma de pagamento do pedido.',
    index: false,
  },
  {
    path: '/resumo',
    title: `Resumo do pedido | ${storeConfig.name}`,
    description: 'Confira os itens e os dados antes de finalizar o pedido.',
    index: false,
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function createSeoBlock(page) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonicalUrl = new URL(page.path, storeConfig.siteUrl).toString();
  const socialImage = `${storeConfig.siteUrl}/og-image.png`;

  return `<!-- route-seo:start -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${page.index ? 'index, follow' : 'noindex, nofollow'}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${escapeHtml(storeConfig.name)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(`${storeConfig.name} — Cardápio digital`)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${socialImage}" />
    <!-- route-seo:end -->`;
}

function generateRouteHtml() {
  return {
    name: 'generate-route-html',
    async closeBundle() {
      const outputDirectory = resolve('dist');
      const template = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
      const seoPattern = /<!-- route-seo:start -->[\s\S]*?<!-- route-seo:end -->/;

      await Promise.all(pages.map(async (page) => {
        const routeDirectory = resolve(outputDirectory, page.path.slice(1));
        await mkdir(routeDirectory, { recursive: true });
        await writeFile(
          resolve(routeDirectory, 'index.html'),
          template.replace(seoPattern, createSeoBlock(page)),
          'utf8',
        );
      }));
    },
  };
}

export default defineConfig({
  plugins: [react(), generateRouteHtml()],
});
