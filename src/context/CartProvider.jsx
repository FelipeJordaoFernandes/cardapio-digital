import {
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { CartContext } from './cartContext';

const CART_STORAGE_KEY = 'cardapio-cart:v1';

const EMPTY_CHECKOUT_DETAILS = {
  customerName: '',
  street: '',
  houseNumber: '',
  neighborhood: '',
  addressComplement: '',
  paymentMethod: '',
  needsChange: '',
  changeFor: '',
};

const EMPTY_CART_SNAPSHOT = {
  items: [],
  notes: '',
  checkoutDetails: EMPTY_CHECKOUT_DETAILS,
};

const cartListeners = new Set();
let cartSnapshot = EMPTY_CART_SNAPSHOT;
let cartInitialized = false;

function restoreCheckoutDetails(storedDetails = {}) {
  return {
    customerName: typeof storedDetails.customerName === 'string' ? storedDetails.customerName : '',
    street: typeof storedDetails.street === 'string' ? storedDetails.street : '',
    houseNumber: typeof storedDetails.houseNumber === 'string' ? storedDetails.houseNumber : '',
    neighborhood: typeof storedDetails.neighborhood === 'string' ? storedDetails.neighborhood : '',
    addressComplement: typeof storedDetails.addressComplement === 'string'
      ? storedDetails.addressComplement
      : '',
    paymentMethod: ['pix', 'card', 'cash'].includes(storedDetails.paymentMethod)
      ? storedDetails.paymentMethod
      : '',
    needsChange: ['yes', 'no'].includes(storedDetails.needsChange)
      ? storedDetails.needsChange
      : '',
    changeFor: typeof storedDetails.changeFor === 'string' ? storedDetails.changeFor : '',
  };
}

function getCartSnapshot() {
  if (!cartInitialized) {
    cartInitialized = true;

    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (parsedCart.version === 1 && Array.isArray(parsedCart.items)) {
          cartSnapshot = {
            items: parsedCart.items,
            notes: typeof parsedCart.notes === 'string' ? parsedCart.notes : '',
            checkoutDetails: restoreCheckoutDetails(parsedCart.checkoutDetails),
          };
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }

  return cartSnapshot;
}

function subscribeToCart(listener) {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function updateCart(updater) {
  cartSnapshot = updater(getCartSnapshot());

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: 1, ...cartSnapshot }),
    );
  } catch {
    // O carrinho continua funcionando na sessão quando o armazenamento é bloqueado.
  }

  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }) {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART_SNAPSHOT,
  );
  const { items, notes, checkoutDetails } = snapshot;

  const addItem = useCallback((newItem) => {
    updateCart((currentCart) => {
      const existingItem = currentCart.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        return {
          ...currentCart,
          items: [...currentCart.items, { ...newItem, quantity: 1 }],
        };
      }

      return {
        ...currentCart,
        items: currentCart.items.map((item) => (
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )),
      };
    });
  }, []);

  const increaseItem = useCallback((id) => {
    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.map((item) => (
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )),
    }));
  }, []);

  const decreaseItem = useCallback((id) => {
    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.flatMap((item) => {
        if (item.id !== id) return [item];
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      }),
    }));
  }, []);

  const removeItem = useCallback((id) => {
    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.filter((item) => item.id !== id),
    }));
  }, []);

  const setNotes = useCallback((newNotes) => {
    updateCart((currentCart) => ({ ...currentCart, notes: newNotes }));
  }, []);

  const updateCheckoutDetails = useCallback((newDetails) => {
    updateCart((currentCart) => ({
      ...currentCart,
      checkoutDetails: { ...currentCart.checkoutDetails, ...newDetails },
    }));
  }, []);

  const clearOrder = useCallback(() => {
    updateCart(() => EMPTY_CART_SNAPSHOT);
  }, []);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      notes,
      checkoutDetails,
      itemCount,
      total,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      setNotes,
      updateCheckoutDetails,
      clearOrder,
    }),
    [
      items,
      notes,
      checkoutDetails,
      itemCount,
      total,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      setNotes,
      updateCheckoutDetails,
      clearOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
