import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nome do Estabelecimento | Cardápio digital',
  description: 'Escolha seus produtos e monte seu pedido de forma rápida.',
};

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Voltar ao início">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-copy">
            <strong>Nome do Estabelecimento</strong>
            <small>Cardápio online</small>
          </span>
        </Link>

        <button className="cart-button" type="button" aria-label="Abrir carrinho">
          <span aria-hidden="true">🛒</span>
          <span className="cart-button__text">Carrinho</span>
          <span className="cart-count" aria-label="0 itens">0</span>
        </button>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={geist.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
