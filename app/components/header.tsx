'use client';

import Link from 'next/link';
import { storeConfig } from '../config/store';
import { useCart } from './cart-provider';

export function Header() {
  const { itemCount } = useCart();
  const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} itens`;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-copy">
            <strong>{storeConfig.name}</strong>
            <small>Cardápio online</small>
          </span>
        </Link>

        <Link className="cart-button" href="/carrinho" aria-label={`Abrir carrinho, ${itemLabel}`}>
          <span aria-hidden="true">🛒</span>
          <span className="cart-button__text">Carrinho</span>
          <span className="cart-count" aria-live="polite">{itemCount}</span>
        </Link>
      </div>
    </header>
  );
}
