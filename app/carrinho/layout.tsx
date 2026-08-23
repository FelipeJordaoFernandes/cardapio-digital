import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrinho',
  description: 'Revise os produtos adicionados ao seu pedido.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
