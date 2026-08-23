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
  itemCount: number;
  total: number;
  addItem: (item: NewCartItem) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: CartItem[] = [];
const cartListeners = new Set<() => void>();
let cartItems: CartItem[] = EMPTY_CART;
let cartInitialized = false;

function getCartSnapshot() {
  if (!cartInitialized && typeof window !== 'undefined') {
    cartInitialized = true;
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as { version?: number; items?: CartItem[] };
        if (parsedCart.version === 1 && Array.isArray(parsedCart.items)) {
          cartItems = parsedCart.items;
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }

  return cartItems;
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function updateCart(updater: (currentItems: CartItem[]) => CartItem[]) {
  cartItems = updater(getCartSnapshot());
  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: 1, items: cartItems }),
    );
  } catch {
    // O carrinho continua funcionando na sessão quando o armazenamento é bloqueado.
  }
  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => EMPTY_CART);

  const addItem = useCallback((newItem: NewCartItem) => {
    updateCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      if (!existingItem) {
        return [...currentItems, { ...newItem, quantity: 1 }];
      }

      return currentItems.map((item) =>
        item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  }, []);

  const increaseItem = useCallback((id: string) => {
    updateCart((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decreaseItem = useCallback((id: string) => {
    updateCart((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== id) return [item];
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      }),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    updateCart((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const value = useMemo(
    () => ({ items, itemCount, total, addItem, increaseItem, decreaseItem, removeItem }),
    [items, itemCount, total, addItem, increaseItem, decreaseItem, removeItem],
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
