import { useCallback, useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../data/menu';
import { useCart } from '../../context/useCart';
import { ComboModal } from './ComboModal';
import { QuantityControl } from './QuantityControl';

function createItemId(...parts) {
  return parts
    .join(':')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9:]+/g, '-');
}

export function ProductList({ category, portionOptions, beverageOptions }) {
  const { items, addItem, decreaseItem } = useCart();
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [addedNotice, setAddedNotice] = useState(null);
  const toastTimerRef = useRef(null);
  const noticeIdRef = useRef(0);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const closeCombo = useCallback(() => setSelectedCombo(null), []);

  const showAddedMessage = useCallback((productName) => {
    noticeIdRef.current += 1;
    setAddedNotice({
      id: noticeIdRef.current,
      message: `${productName} adicionado ao carrinho`,
    });

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setAddedNotice(null), 2200);
  }, []);

  function addRegularProduct(product) {
    addItem({
      id: createItemId(category.slug, product.name),
      name: product.name,
      unitPrice: product.price,
      emoji: product.emoji,
    });
    showAddedMessage(product.name);
  }

  function addConfiguredCombo(portion, beverage) {
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
    closeCombo();
  }

  return (
    <>
      <section className="product-list" aria-label={`Produtos de ${category.name}`}>
        {category.products.map((product) => {
          const isCombo = category.slug === 'combos';
          const productId = createItemId(category.slug, product.name);
          const matchingItems = items.filter((item) => (
            isCombo ? item.id.startsWith(`${productId}:`) : item.id === productId
          ));
          const productQuantity = matchingItems.reduce(
            (quantity, item) => quantity + item.quantity,
            0,
          );
          const itemToDecrease = matchingItems.at(-1);
          const addAnotherItem = () => (
            isCombo ? setSelectedCombo(product) : addRegularProduct(product)
          );

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
                  <QuantityControl
                    compact
                    name={product.name}
                    quantity={productQuantity}
                    onDecrease={() => itemToDecrease && decreaseItem(itemToDecrease.id)}
                    onIncrease={addAnotherItem}
                  />
                ) : (
                  <button
                    className="product-add-button"
                    type="button"
                    onClick={addAnotherItem}
                    aria-label={isCombo
                      ? `Personalizar ${product.name}`
                      : `Adicionar ${product.name} ao carrinho`}
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
          onClose={closeCombo}
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
