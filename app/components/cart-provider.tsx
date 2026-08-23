'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

const CART_STORAGE_KEY = 'cardapio-cart:v1';

export type CartItemOption = {
  label: string;
  value: string;
};

export type CartItem = {
  id: string;
  name: string;
  unitPrice: number;
  emoji: string;
  quantity: number;
  options?: CartItemOption[];
};

export type PaymentMethod = '' | 'pix' | 'card' | 'cash';
export type ChangeOption = '' | 'yes' | 'no';

export type CheckoutDetails = {
  customerName: string;
  street: string;
  houseNumber: string;
  neighborhood: string;
  paymentMethod: PaymentMethod;
  needsChange: ChangeOption;
  changeFor: string;
};

type NewCartItem = Omit<CartItem, 'quantity'>;

type CartContextValue = {
  items: CartItem[];
  notes: string;
  checkoutDetails: CheckoutDetails;
  itemCount: number;
  total: number;
  addItem: (item: NewCartItem) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  setNotes: (notes: string) => void;
  updateCheckoutDetails: (details: Partial<CheckoutDetails>) => void;
  clearOrder: () => void;
};

type CartSnapshot = {
  items: CartItem[];
  notes: string;
  checkoutDetails: CheckoutDetails;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CHECKOUT_DETAILS: CheckoutDetails = {
  customerName: '',
  street: '',
  houseNumber: '',
  neighborhood: '',
  paymentMethod: '',
  needsChange: '',
  changeFor: '',
};

const EMPTY_CART_SNAPSHOT: CartSnapshot = {
  items: [],
  notes: '',
  checkoutDetails: EMPTY_CHECKOUT_DETAILS,
};
const cartListeners = new Set<() => void>();
let cartSnapshot = EMPTY_CART_SNAPSHOT;
let cartInitialized = false;

function getCartSnapshot() {
  if (!cartInitialized && typeof window !== 'undefined') {
    cartInitialized = true;
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as {
          version?: number;
          items?: CartItem[];
          notes?: string;
          checkoutDetails?: Partial<CheckoutDetails>;
        };
        if (parsedCart.version === 1 && Array.isArray(parsedCart.items)) {
          const storedDetails = parsedCart.checkoutDetails;
          cartSnapshot = {
            items: parsedCart.items,
            notes: typeof parsedCart.notes === 'string' ? parsedCart.notes : '',
            checkoutDetails: {
              customerName: typeof storedDetails?.customerName === 'string' ? storedDetails.customerName : '',
              street: typeof storedDetails?.street === 'string' ? storedDetails.street : '',
              houseNumber: typeof storedDetails?.houseNumber === 'string' ? storedDetails.houseNumber : '',
              neighborhood: typeof storedDetails?.neighborhood === 'string' ? storedDetails.neighborhood : '',
              paymentMethod: ['pix', 'card', 'cash'].includes(storedDetails?.paymentMethod ?? '')
                ? storedDetails?.paymentMethod as PaymentMethod
                : '',
              needsChange: ['yes', 'no'].includes(storedDetails?.needsChange ?? '')
                ? storedDetails?.needsChange as ChangeOption
                : '',
              changeFor: typeof storedDetails?.changeFor === 'string' ? storedDetails.changeFor : '',
            },
          };
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }

  return cartSnapshot;
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function updateCart(updater: (currentCart: CartSnapshot) => CartSnapshot) {
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

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART_SNAPSHOT,
  );
  const { items, notes, checkoutDetails } = snapshot;

  const addItem = useCallback((newItem: NewCartItem) => {
    updateCart((currentCart) => {
      const currentItems = currentCart.items;
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      if (!existingItem) {
        return {
          ...currentCart,
          items: [...currentItems, { ...newItem, quantity: 1 }],
        };
      }

      return {
        ...currentCart,
        items: currentItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    });
  }, []);

  const increaseItem = useCallback((id: string) => {
    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    }));
  }, []);

  const decreaseItem = useCallback((id: string) => {
    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.flatMap((item) => {
        if (item.id !== id) return [item];
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      }),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.filter((item) => item.id !== id),
    }));
  }, []);

  const setNotes = useCallback((newNotes: string) => {
    updateCart((currentCart) => ({ ...currentCart, notes: newNotes }));
  }, []);

  const updateCheckoutDetails = useCallback((newDetails: Partial<CheckoutDetails>) => {
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider.');
  }
  return context;
}
