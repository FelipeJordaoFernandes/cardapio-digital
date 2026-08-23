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

type NewCartItem = Omit<CartItem, 'quantity'>;

type CartContextValue = {
  items: CartItem[];
  notes: string;
  itemCount: number;
  total: number;
  addItem: (item: NewCartItem) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  setNotes: (notes: string) => void;
};

type CartSnapshot = {
  items: CartItem[];
  notes: string;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART_SNAPSHOT: CartSnapshot = { items: [], notes: '' };
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
        };
        if (parsedCart.version === 1 && Array.isArray(parsedCart.items)) {
          cartSnapshot = {
            items: parsedCart.items,
            notes: typeof parsedCart.notes === 'string' ? parsedCart.notes : '',
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
  const { items, notes } = snapshot;

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

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      notes,
      itemCount,
      total,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      setNotes,
    }),
    [items, notes, itemCount, total, addItem, increaseItem, decreaseItem, removeItem, setNotes],
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
