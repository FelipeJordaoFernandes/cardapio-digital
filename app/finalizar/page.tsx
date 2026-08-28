'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, type KeyboardEvent, type RefObject } from 'react';
import {
  useCart,
  type PaymentMethod,
} from '../components/cart-provider';
import { formatPrice } from '../data/menu';
import { formatCurrencyValue } from '../utils/currency';

const paymentOptions: Array<{
  value: Exclude<PaymentMethod, ''>;
  label: string;
  icon: string;
}> = [
  { value: 'pix', label: 'Pix', icon: '◆' },
  { value: 'card', label: 'Cartão', icon: '💳' },
  { value: 'cash', label: 'Dinheiro', icon: '💵' },
];

const paymentGuidance = {
  pix: {
    icon: '💬',
    text: 'O estabelecimento informará o código Pix para realizar o pagamento.',
  },
  card: {
    icon: '🚚',
    text: 'O entregador levará a maquininha para realizar o pagamento no local.',
  },
};

function focusNextField(
  event: KeyboardEvent<HTMLInputElement>,
  nextField: RefObject<HTMLInputElement | null>,
) {
  if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
  event.preventDefault();
  nextField.current?.focus();
}

export default function CheckoutPage() {
  const router = useRouter();
  const streetInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  const neighborhoodInputRef = useRef<HTMLInputElement>(null);
  const complementInputRef = useRef<HTMLInputElement>(null);
  const {
    items,
    total,
    checkoutDetails,
    updateCheckoutDetails,
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
  const canProceed = items.length > 0
    && deliveryDataComplete
    && paymentMethod !== ''
    && cashDataComplete;
  const guidance = paymentMethod === 'pix' || paymentMethod === 'card'
    ? paymentGuidance[paymentMethod]
    : null;

  return (
    <main className="page-shell checkout-page" id="main-content" tabIndex={-1}>
      <Link className="back-link" href="/carrinho">
        <span aria-hidden="true">←</span> Voltar ao carrinho
      </Link>

      <section className="checkout-heading" aria-labelledby="checkout-title">
        <span className="eyebrow">Dados do pedido</span>
        <h1 id="checkout-title">Dados para entrega</h1>
        <p>Preencha as informações para que o estabelecimento prepare seu pedido.</p>
      </section>

      <form
        className="checkout-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (canProceed) router.push('/resumo');
        }}
      >
        <section className="checkout-card" aria-labelledby="delivery-data-title">
          <div className="checkout-card__heading">
            <span aria-hidden="true">1</span>
            <div>
              <h2 id="delivery-data-title">Quem vai receber?</h2>
              <p>Informe o nome e o endereço de entrega.</p>
            </div>
          </div>

          <div className="checkout-fields">
            <label className="form-field form-field--full">
              <span>Nome do cliente</span>
              <input
                type="text"
                name="customerName"
                autoComplete="name"
                placeholder="Digite seu nome"
                value={customerName}
                onChange={(event) => updateCheckoutDetails({ customerName: event.target.value })}
                onKeyDown={(event) => focusNextField(event, streetInputRef)}
                enterKeyHint="next"
                required
              />
            </label>

            <div className="address-fields">
              <label className="form-field form-field--street">
                <span>Rua</span>
                <input
                  type="text"
                  name="street"
                  autoComplete="address-line1"
                  placeholder="Nome da rua"
                  value={street}
                  onChange={(event) => updateCheckoutDetails({ street: event.target.value })}
                  onKeyDown={(event) => focusNextField(event, numberInputRef)}
                  enterKeyHint="next"
                  ref={streetInputRef}
                  required
                />
              </label>

              <label className="form-field form-field--number">
                <span>Número</span>
                <input
                  type="text"
                  name="houseNumber"
                  inputMode="numeric"
                  placeholder="Nº"
                  value={houseNumber}
                  onChange={(event) => updateCheckoutDetails({ houseNumber: event.target.value })}
                  onKeyDown={(event) => focusNextField(event, neighborhoodInputRef)}
                  enterKeyHint="next"
                  ref={numberInputRef}
                  required
                />
              </label>

              <label className="form-field form-field--neighborhood">
                <span>Bairro</span>
                <input
                  type="text"
                  name="neighborhood"
                  autoComplete="address-level3"
                  placeholder="Nome do bairro"
                  value={neighborhood}
                  onChange={(event) => updateCheckoutDetails({ neighborhood: event.target.value })}
                  onKeyDown={(event) => focusNextField(event, complementInputRef)}
                  enterKeyHint="next"
                  ref={neighborhoodInputRef}
                  required
                />
              </label>

              <label className="form-field form-field--complement">
                <span>Complemento <small>(opcional)</small></span>
                <input
                  type="text"
                  name="addressComplement"
                  autoComplete="address-line2"
                  placeholder="Ex.: apto. 12 ou casa dos fundos"
                  value={addressComplement}
                  onChange={(event) => updateCheckoutDetails({ addressComplement: event.target.value })}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
                    event.preventDefault();
                    event.currentTarget.blur();
                  }}
                  enterKeyHint="done"
                  ref={complementInputRef}
                />
              </label>
            </div>
          </div>
        </section>

        <fieldset className="checkout-card payment-card">
          <legend className="checkout-card__heading">
            <span aria-hidden="true">2</span>
            <span className="checkout-card__legend-copy">
              <strong>Forma de pagamento</strong>
              <small>Escolha uma das opções abaixo.</small>
            </span>
          </legend>

          <div className="payment-options">
            {paymentOptions.map((option) => (
              <label className="payment-option" key={option.value}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={() => updateCheckoutDetails({
                    paymentMethod: option.value,
                    ...(option.value === 'cash'
                      ? {}
                      : { needsChange: '', changeFor: '' }),
                  })}
                  required
                />
                <span className="payment-option__icon" aria-hidden="true">{option.icon}</span>
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {guidance ? (
            <div className="payment-guidance" role="note">
              <span aria-hidden="true">{guidance.icon}</span>
              <p>{guidance.text}</p>
            </div>
          ) : null}

          {paymentMethod === 'cash' ? (
            <div className="cash-details">
              <p>Vai ser necessário troco?</p>
              <div className="change-options">
                <label>
                  <input
                    type="radio"
                    name="needsChange"
                    value="no"
                    checked={needsChange === 'no'}
                    onChange={() => updateCheckoutDetails({ needsChange: 'no', changeFor: '' })}
                    required
                  />
                  <span>Não</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="needsChange"
                    value="yes"
                    checked={needsChange === 'yes'}
                    onChange={() => updateCheckoutDetails({ needsChange: 'yes' })}
                    required
                  />
                  <span>Sim</span>
                </label>
              </div>

              {needsChange === 'yes' ? (
                <label className="form-field change-value-field">
                  <span>Troco para quanto?</span>
                  <input
                    type="text"
                    name="changeFor"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={changeFor}
                    onChange={(event) => updateCheckoutDetails({
                      changeFor: formatCurrencyValue(event.target.value),
                    })}
                    aria-describedby="change-value-hint"
                    required
                  />
                  <small className="field-hint" id="change-value-hint">
                    Digite somente os números. O valor será formatado automaticamente.
                  </small>
                </label>
              ) : null}
            </div>
          ) : null}
        </fieldset>

        <section className="checkout-total" aria-label="Total e próxima etapa do pedido">
          <div>
            <span>Total do pedido</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button type="submit" disabled={!canProceed}>Prosseguir</button>
        </section>
      </form>
    </main>
  );
}
