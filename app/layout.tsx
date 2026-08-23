import type { Metadata } from 'next';
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
  title: `${storeConfig.name} | Cardápio digital`,
  description: 'Escolha seus produtos e monte seu pedido de forma rápida.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={geist.variable}>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
