import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { useCart } from '../../context/useCart';

export function AppHeader() {
  const { itemCount } = useCart();
  const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} itens`;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-copy">
            <strong>{storeConfig.name}</strong>
            <small>Cardápio online</small>
          </span>
        </Link>

        <Link className="cart-button" to="/carrinho">
          <span aria-hidden="true">🛒</span>
          <span className="cart-button__text">Carrinho</span>
          <span className="cart-count" aria-hidden="true">{itemCount}</span>
          <span className="visually-hidden" aria-live="polite">{itemLabel}</span>
        </Link>
      </div>
    </header>
  );
}
