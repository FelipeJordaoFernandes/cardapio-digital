'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category, Product } from '../data/menu';
import { formatPrice } from '../data/menu';
import { useCart } from './cart-provider';

type ProductListProps = {
  category: Category;
  portionOptions: Product[];
  beverageOptions: Product[];
};

type ComboModalProps = {
  combo: Product;
  portionOptions: Product[];
  beverageOptions: Product[];
  onClose: () => void;
  onComplete: (portion: Product, beverage: Product) => void;
};

function createItemId(...parts: string[]) {
  return parts
    .join(':')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9:]+/g, '-');
}

function ComboModal({
  combo,
  portionOptions,
  beverageOptions,
  onClose,
  onComplete,
}: ComboModalProps) {
  const [step, setStep] = useState<'portion' | 'beverage'>('portion');
  const [selectedPortion, setSelectedPortion] = useState<Product | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const choiceListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!dialogRef.current.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  const focusFirstChoice = () => {
    requestAnimationFrame(() => {
      choiceListRef.current?.querySelector<HTMLButtonElement>('.choice-button')?.focus();
    });
  };

  const selectPortion = (portion: Product) => {
    setSelectedPortion(portion);
    setStep('beverage');
    focusFirstChoice();
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="combo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="combo-modal-title"
        aria-describedby="combo-modal-product"
        ref={dialogRef}
      >
        <div className="combo-modal__handle" aria-hidden="true" />
        <header className="combo-modal__header">
          <div aria-live="polite" aria-atomic="true">
            <span className="eyebrow">{step === 'portion' ? 'Etapa 1 de 2' : 'Etapa 2 de 2'}</span>
            <h2 id="combo-modal-title">
              {step === 'portion' ? 'Escolha a porção' : 'Escolha a bebida'}
            </h2>
            <p id="combo-modal-product">{combo.name}</p>
          </div>
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            ref={closeButtonRef}
            aria-label="Fechar personalização"
          >
            ×
          </button>
        </header>

        {step === 'portion' ? (
          <div
            className="choice-list"
            role="group"
            aria-label="Opções de porção"
            ref={choiceListRef}
          >
            {portionOptions.map((portion) => (
              <button
                className="choice-button"
                type="button"
                key={portion.name}
                onClick={() => selectPortion(portion)}
              >
                <span className="choice-button__emoji" aria-hidden="true">{portion.emoji}</span>
                <span className="choice-button__copy">
                  <strong>{portion.name}</strong>
                  <small>{portion.description}</small>
                </span>
                <span className="choice-button__price">{formatPrice(portion.price)}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button
              className="selection-summary"
              type="button"
              onClick={() => {
                setStep('portion');
                focusFirstChoice();
              }}
            >
              <span>
                <small>Porção escolhida</small>
                <strong>{selectedPortion?.name}</strong>
              </span>
              <span>Alterar</span>
            </button>

            <div
              className="choice-list"
              role="group"
              aria-label="Opções de bebida"
              ref={choiceListRef}
            >
              {beverageOptions.map((beverage) => (
                <button
                  className="choice-button"
                  type="button"
                  key={beverage.name}
                  onClick={() => selectedPortion && onComplete(selectedPortion, beverage)}
                >
                  <span className="choice-button__emoji" aria-hidden="true">{beverage.emoji}</span>
                  <span className="choice-button__copy">
                    <strong>{beverage.name}</strong>
                    <small>{beverage.description}</small>
                  </span>
                  <span className="choice-button__price">{formatPrice(beverage.price)}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export function ProductList({ category, portionOptions, beverageOptions }: ProductListProps) {
  const { items, addItem, decreaseItem } = useCart();
  const [selectedCombo, setSelectedCombo] = useState<Product | null>(null);
  const [addedNotice, setAddedNotice] = useState<{ id: number; message: string } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeIdRef = useRef(0);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const showAddedMessage = (productName: string) => {
    noticeIdRef.current += 1;
    setAddedNotice({
      id: noticeIdRef.current,
      message: `${productName} adicionado ao carrinho`,
    });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setAddedNotice(null), 2200);
  };

  const addRegularProduct = (product: Product) => {
    addItem({
      id: createItemId(category.slug, product.name),
      name: product.name,
      unitPrice: product.price,
      emoji: product.emoji,
    });
    showAddedMessage(product.name);
  };

  const addConfiguredCombo = (portion: Product, beverage: Product) => {
    if (!selectedCombo) return;

    addItem({
      id: createItemId(category.slug, selectedCombo.name, portion.name, beverage.name),
      name: selectedCombo.name,
      unitPrice: (selectedCombo.basePrice ?? 0) + portion.price + beverage.price,
      emoji: selectedCombo.emoji,
      options: [
        { label: 'Porção', value: portion.name },
        { label: 'Bebida', value: beverage.name },
      ],
    });
    showAddedMessage(selectedCombo.name);
    setSelectedCombo(null);
  };

  return (
    <>
      <section className="product-list" aria-label={`Produtos de ${category.name}`}>
        {category.products.map((product) => {
          const isCombo = category.slug === 'combos';
          const productId = createItemId(category.slug, product.name);
          const matchingItems = items.filter((item) =>
            isCombo ? item.id.startsWith(`${productId}:`) : item.id === productId,
          );
          const productQuantity = matchingItems.reduce(
            (quantity, item) => quantity + item.quantity,
            0,
          );
          const itemToDecrease = matchingItems[matchingItems.length - 1];
          const actionLabel = isCombo
            ? `Personalizar ${product.name}`
            : `Adicionar ${product.name} ao carrinho`;
          const addAnotherItem = () =>
            isCombo ? setSelectedCombo(product) : addRegularProduct(product);

          return (
            <article className="product-card" key={product.name}>
              <div className="product-card__content">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <strong>
                  {product.startingAt ? 'A partir de ' : ''}
                  {formatPrice(product.price)}
                </strong>
              </div>
              <div className="product-card__actions">
                <div className="product-card__visual" aria-hidden="true">
                  <span>{product.emoji}</span>
                </div>

                {productQuantity > 0 ? (
                  <div
                    className="menu-quantity-control"
                    role="group"
                    aria-label={`Quantidade de ${product.name}`}
                  >
                    <button
                      type="button"
                      onClick={() => itemToDecrease && decreaseItem(itemToDecrease.id)}
                      aria-label={`Diminuir quantidade de ${product.name}`}
                    >
                      −
                    </button>
                    <span aria-live="polite">{productQuantity}</span>
                    <button
                      type="button"
                      onClick={addAnotherItem}
                      aria-label={`Adicionar mais uma unidade de ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="product-add-button"
                    type="button"
                    onClick={addAnotherItem}
                    aria-label={actionLabel}
                  >
                    {isCombo ? 'Personalizar' : 'Adicionar'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {selectedCombo ? (
        <ComboModal
          combo={selectedCombo}
          portionOptions={portionOptions}
          beverageOptions={beverageOptions}
          onClose={() => setSelectedCombo(null)}
          onComplete={addConfiguredCombo}
        />
      ) : null}

      {addedNotice ? (
        <div className="added-toast" role="status" aria-live="polite" key={addedNotice.id}>
          <span aria-hidden="true">✓</span>
          {addedNotice.message}
        </div>
      ) : null}
    </>
  );
}
