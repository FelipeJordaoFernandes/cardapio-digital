'use client';

import Link from 'next/link';
import { useCart } from '../components/cart-provider';
import { formatPrice } from '../data/menu';

export default function CartPage() {
  const {
    items,
    notes,
    itemCount,
    total,
    increaseItem,
    decreaseItem,
    removeItem,
    setNotes,
  } = useCart();
  const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} itens`;

  return (
    <main className="page-shell cart-page">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> Continuar comprando
      </Link>

      <section className="cart-heading" aria-labelledby="cart-title">
        <span className="eyebrow">Seu pedido</span>
        <div>
          <h1 id="cart-title">Carrinho</h1>
          <span>{itemLabel}</span>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="empty-cart">
          <span className="empty-cart__icon" aria-hidden="true">🛒</span>
          <h2>Seu carrinho está vazio</h2>
          <p>Escolha uma categoria e adicione seus produtos favoritos.</p>
          <Link className="primary-link" href="/">Ver cardápio</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-list" aria-label="Itens do carrinho">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <span className="cart-item__emoji" aria-hidden="true">{item.emoji}</span>

                <div className="cart-item__content">
                  <div className="cart-item__title-row">
                    <h2>{item.name}</h2>
                    <button
                      className="remove-item"
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remover ${item.name} do carrinho`}
                    >
                      Remover
                    </button>
                  </div>

                  {item.options ? (
                    <ul className="cart-item__options">
                      {item.options.map((option) => (
                        <li key={option.label}>
                          <span>{option.label}:</span> {option.value}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="cart-item__footer">
                    <div className="quantity-control" aria-label={`Quantidade de ${item.name}`}>
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-sidebar">
            <section className="order-notes">
              <label htmlFor="order-notes">Observações do pedido</label>
              <textarea
                id="order-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Ex.: tirar a salada do lanche"
                maxLength={300}
                rows={4}
              />
            </section>

            <div className="cart-summary" aria-label="Resumo do carrinho">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
