export function QuantityControl({ name, quantity, onDecrease, onIncrease, compact = false }) {
  return (
    <div
      className={compact ? 'menu-quantity-control' : 'quantity-control'}
      role="group"
      aria-label={`Quantidade de ${name}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label={`Diminuir quantidade de ${name}`}
      >
        −
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={`${compact ? 'Adicionar mais uma unidade' : 'Aumentar quantidade'} de ${name}`}
      >
        +
      </button>
    </div>
  );
}
