import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dados para entrega',
  description: 'Informe os dados de entrega e a forma de pagamento do pedido.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
