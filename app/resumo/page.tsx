'use client';

import Link from 'next/link';
import { useCart, type PaymentMethod } from '../components/cart-provider';
import { formatPrice } from '../data/menu';
import { buildWhatsAppOrderUrl } from '../utils/whatsapp';

const paymentLabels: Record<Exclude<PaymentMethod, ''>, string> = {
  pix: 'Pix',
  card: 'Cartão',
  cash: 'Dinheiro',
};

export default function OrderSummaryPage() {
  const {
    items,
    notes,
    total,
    checkoutDetails,
    clearOrder,
  } = useCart();
  const {
    customerName,
    street,
    houseNumber,
    neighborhood,
    paymentMethod,
    needsChange,
    changeFor,
  } = checkoutDetails;

  const deliveryDataComplete = [customerName, street, houseNumber, neighborhood]
    .every((value) => value.trim().length > 0);
  const cashDataComplete = paymentMethod !== 'cash'
    || (needsChange !== '' && (needsChange === 'no' || changeFor.trim().length > 0));
  const orderReady = items.length > 0
    && deliveryDataComplete
    && paymentMethod !== ''
    && cashDataComplete;

  function finalizeOrder() {
    if (!orderReady) return;

    const whatsappUrl = buildWhatsAppOrderUrl({
      items,
      notes,
      total,
      checkoutDetails,
    });

    clearOrder();
    window.location.assign(whatsappUrl);
  }

  if (!orderReady) {
    return (
      <main className="page-shell summary-page">
        <Link className="back-link" href="/finalizar">
          <span aria-hidden="true">←</span> Voltar aos dados
        </Link>
        <section className="empty-cart">
          <span className="empty-cart__icon" aria-hidden="true">📋</span>
          <h2>Complete os dados do pedido</h2>
          <p>Preencha as informações de entrega e pagamento antes de revisar.</p>
          <Link className="primary-link" href="/finalizar">Preencher dados</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell summary-page">
      <Link className="back-link" href="/finalizar">
        <span aria-hidden="true">←</span> Editar dados
      </Link>

      <section className="summary-heading" aria-labelledby="summary-title">
        <span className="eyebrow">Última conferência</span>
        <h1 id="summary-title">Revise seu pedido</h1>
        <p>Confira os itens e os dados antes de finalizar.</p>
      </section>

      <div className="order-review">
        <section className="review-card" aria-labelledby="review-items-title">
          <div className="review-card__heading">
            <span aria-hidden="true">🛍️</span>
            <h2 id="review-items-title">Itens do pedido</h2>
          </div>

          <div className="review-items">
            {items.map((item) => (
              <article className="review-item" key={item.id}>
                <span className="review-item__quantity">{item.quantity}×</span>
                <div>
                  <h3>{item.name}</h3>
                  {item.options ? (
                    <ul>
                      {item.options.map((option) => (
                        <li key={option.label}>{option.label}: {option.value}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="review-card" aria-labelledby="review-delivery-title">
          <div className="review-card__heading">
            <span aria-hidden="true">📍</span>
            <h2 id="review-delivery-title">Entrega</h2>
          </div>
          <dl className="review-details">
            <div>
              <dt>Cliente</dt>
              <dd>{customerName}</dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>{street}, {houseNumber} — {neighborhood}</dd>
            </div>
          </dl>
        </section>

        <section className="review-card" aria-labelledby="review-payment-title">
          <div className="review-card__heading">
            <span aria-hidden="true">💳</span>
            <h2 id="review-payment-title">Pagamento</h2>
          </div>
          <dl className="review-details">
            <div>
              <dt>Forma de pagamento</dt>
              <dd>{paymentMethod ? paymentLabels[paymentMethod] : ''}</dd>
            </div>
            {paymentMethod === 'cash' ? (
              <div>
                <dt>Troco</dt>
                <dd>{needsChange === 'yes' ? `Para ${changeFor}` : 'Não precisa'}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="review-card" aria-labelledby="review-notes-title">
          <div className="review-card__heading">
            <span aria-hidden="true">📝</span>
            <h2 id="review-notes-title">Observações</h2>
          </div>
          <p className={notes.trim() ? 'review-notes' : 'review-notes review-notes--empty'}>
            {notes.trim() || 'Nenhuma observação adicionada.'}
          </p>
        </section>

        <section className="final-order-card" aria-label="Total e finalização do pedido">
          <div>
            <span>Total do pedido</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button type="button" onClick={finalizeOrder}>Finalizar pedido</button>
        </section>
      </div>
    </main>
  );
}
