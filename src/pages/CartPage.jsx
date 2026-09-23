import { Link } from 'react-router-dom';
import { QuantityControl } from '../components/menu/QuantityControl';
import { useCart } from '../context/useCart';
import { formatPrice } from '../data/menu';
import { usePageMetadata } from '../hooks/usePageMetadata';

export function CartPage() {
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

  usePageMetadata({
    title: 'Carrinho',
    description: 'Revise os produtos adicionados ao seu pedido.',
    path: '/carrinho',
    index: false,
  });

  return (
    <main className="page-shell cart-page" id="main-content" tabIndex="-1">
      <Link className="back-link" to="/">
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
          <Link className="primary-link" to="/">Ver cardápio</Link>
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
                    <QuantityControl
                      name={item.name}
                      quantity={item.quantity}
                      onDecrease={() => decreaseItem(item.id)}
                      onIncrease={() => increaseItem(item.id)}
                    />
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
                maxLength="300"
                rows="4"
              />
            </section>

            <div className="cart-summary" aria-label="Resumo do carrinho">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <Link className="checkout-link" to="/finalizar">
                Prosseguir
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
