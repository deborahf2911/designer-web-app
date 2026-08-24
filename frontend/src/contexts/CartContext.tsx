import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "../types/cart";

interface CartContextType {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (id: string) => void;

  updateQuantity: (
    id: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  cartCount: number;

  subtotal: number;
}

const CartContext =
  createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart =
      localStorage.getItem("kingdom-threads-cart");

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart) as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "kingdom-threads-cart",
      JSON.stringify(items)
    );
  }, [items]);

  function addItem(item: CartItem) {
    setItems((previous) => [
      ...previous,
      item,
    ]);
  }

  function removeItem(id: string) {
    setItems((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  }

  function updateQuantity(
    id: string,
    quantity: number
  ) {
    const safeQuantity =
      Math.max(1, quantity);

    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        item.unitPrice *
          item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}