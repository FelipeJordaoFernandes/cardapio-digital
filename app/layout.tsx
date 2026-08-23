import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { CartProvider } from './components/cart-provider';
import { Header } from './components/header';
import { storeConfig } from './config/store';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(storeConfig.siteUrl),
  title: {
    default: `${storeConfig.name} | Cardápio digital`,
    template: `%s | ${storeConfig.name}`,
  },
  description: storeConfig.description,
  applicationName: storeConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: storeConfig.name,
    title: `${storeConfig.name} | Cardápio digital`,
    description: storeConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${storeConfig.name} | Cardápio digital`,
    description: storeConfig.description,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e74423',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={geist.variable}>
        <CartProvider>
          <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
