import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { formatPrice } from '../data/menu';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { formatCurrencyValue } from '../utils/currency';

const paymentLabels = {
  pix: 'Pix',
  card: 'Cartão',
  cash: 'Dinheiro',
};

export function OrderSummaryPage() {
  const navigate = useNavigate();
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
    addressComplement,
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
  const formattedChangeFor = formatCurrencyValue(changeFor);

  usePageMetadata({
    title: 'Resumo do pedido',
    description: 'Confira os itens e os dados antes de finalizar o pedido.',
    path: '/resumo',
    index: false,
  });

  function finalizeOrder() {
    if (!orderReady) return;

    clearOrder();
    navigate('/', { replace: true });
  }

  if (!orderReady) {
    return (
      <main className="page-shell summary-page" id="main-content" tabIndex="-1">
        <Link className="back-link" to="/finalizar">
          <span aria-hidden="true">←</span> Voltar aos dados
        </Link>
        <section className="empty-cart">
          <span className="empty-cart__icon" aria-hidden="true">📋</span>
          <h1>Complete os dados do pedido</h1>
          <p>Preencha as informações de entrega e pagamento antes de revisar.</p>
          <Link className="primary-link" to="/finalizar">Preencher dados</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell summary-page" id="main-content" tabIndex="-1">
      <Link className="back-link" to="/finalizar">
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
            {addressComplement.trim() ? (
              <div>
                <dt>Complemento</dt>
                <dd>{addressComplement.trim()}</dd>
              </div>
            ) : null}
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
                <dd>{needsChange === 'yes' ? `Para ${formattedChangeFor}` : 'Não precisa'}</dd>
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
