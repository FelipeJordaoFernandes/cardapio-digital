import { Link } from 'react-router-dom';
import { usePageMetadata } from '../hooks/usePageMetadata';

export function NotFoundPage() {
  usePageMetadata({
    title: 'Página não encontrada',
    description: 'A página solicitada não foi encontrada.',
    path: window.location.pathname,
    index: false,
  });

  return (
    <main className="page-shell summary-page" id="main-content" tabIndex="-1">
      <section className="empty-cart">
        <span className="empty-cart__icon" aria-hidden="true">🔎</span>
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe neste cardápio.</p>
        <Link className="primary-link" to="/">Voltar ao início</Link>
      </section>
    </main>
  );
}
