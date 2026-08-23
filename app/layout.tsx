import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { CartProvider } from './components/cart-provider';
import { Header } from './components/header';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nome do Estabelecimento | Cardápio digital',
  description: 'Escolha seus produtos e monte seu pedido de forma rápida.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={geist.variable}>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
