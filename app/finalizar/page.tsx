'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../components/cart-provider';
import { formatPrice } from '../data/menu';

type PaymentMethod = '' | 'pix' | 'card' | 'cash';
type ChangeOption = '' | 'yes' | 'no';

const paymentOptions: Array<{
  value: Exclude<PaymentMethod, ''>;
  label: string;
  icon: string;
}> = [
  { value: 'pix', label: 'Pix', icon: '◆' },
  { value: 'card', label: 'Cartão', icon: '💳' },
  { value: 'cash', label: 'Dinheiro', icon: '💵' },
];

export default function CheckoutPage() {
  const { total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [changeOption, setChangeOption] = useState<ChangeOption>('');

  return (
    <main className="page-shell checkout-page">
      <Link className="back-link" href="/carrinho">
        <span aria-hidden="true">←</span> Voltar ao carrinho
      </Link>

      <section className="checkout-heading" aria-labelledby="checkout-title">
        <span className="eyebrow">Finalização</span>
        <h1 id="checkout-title">Dados para entrega</h1>
        <p>Preencha as informações para que o estabelecimento prepare seu pedido.</p>
      </section>

      <form className="checkout-form" onSubmit={(event) => event.preventDefault()}>
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
                  required
                />
              </label>

              <label className="form-field form-field--number">
                <span>Número</span>
                <input
                  type="text"
                  name="houseNumber"
                  inputMode="numeric"
                  autoComplete="address-line2"
                  placeholder="Nº"
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
                  required
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
                  onChange={() => {
                    setPaymentMethod(option.value);
                    if (option.value !== 'cash') setChangeOption('');
                  }}
                  required
                />
                <span className="payment-option__icon" aria-hidden="true">{option.icon}</span>
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {paymentMethod === 'cash' ? (
            <div className="cash-details">
              <p>Vai ser necessário troco?</p>
              <div className="change-options">
                <label>
                  <input
                    type="radio"
                    name="needsChange"
                    value="no"
                    checked={changeOption === 'no'}
                    onChange={() => setChangeOption('no')}
                    required
                  />
                  <span>Não</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="needsChange"
                    value="yes"
                    checked={changeOption === 'yes'}
                    onChange={() => setChangeOption('yes')}
                    required
                  />
                  <span>Sim</span>
                </label>
              </div>

              {changeOption === 'yes' ? (
                <label className="form-field change-value-field">
                  <span>Troco para quanto?</span>
                  <input
                    type="text"
                    name="changeFor"
                    inputMode="decimal"
                    placeholder="Ex.: R$ 50,00"
                    required
                  />
                </label>
              ) : null}
            </div>
          ) : null}
        </fieldset>

        <section className="checkout-total" aria-label="Total e finalização do pedido">
          <div>
            <span>Total do pedido</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button type="button">Finalizar pedido</button>
        </section>
      </form>
    </main>
  );
}
