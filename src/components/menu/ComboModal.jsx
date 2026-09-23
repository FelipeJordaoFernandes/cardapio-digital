import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../data/menu';

export function ComboModal({ combo, portionOptions, beverageOptions, onClose, onComplete }) {
  const [step, setStep] = useState('portion');
  const [selectedPortion, setSelectedPortion] = useState(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const choiceListRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(
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
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  function focusFirstChoice() {
    requestAnimationFrame(() => {
      choiceListRef.current?.querySelector('.choice-button')?.focus();
    });
  }

  function selectPortion(portion) {
    setSelectedPortion(portion);
    setStep('beverage');
    focusFirstChoice();
  }

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
