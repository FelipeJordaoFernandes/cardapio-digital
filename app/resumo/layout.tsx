import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resumo do pedido',
  description: 'Confira os itens e os dados antes de finalizar o pedido.',
  robots: { index: false, follow: false },
};

export default function SummaryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
