"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { Product, CartItem } from "@/types";
import { productsData } from "@/data/menu-data";
import { useStoredValue, writeStoredValue } from "@/context/storage";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isVideoOpen: boolean;
  setIsVideoOpen: (open: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function isStoredCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Partial<CartItem>;
  if (typeof item.product !== "object" || item.product === null) return false;

  const product = item.product as Partial<Product>;
  return (
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    typeof product.category === "string" &&
    typeof product.image === "string" &&
    typeof product.description === "string"
  );
}

function isStoredCart(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every(isStoredCartItem);
}

function normalizeCart(cart: CartItem[]) {
  const itemsById = new Map<string, CartItem>();

  for (const item of cart) {
    const catalogProduct = productsData.find(
      (product) => product.id === item.product.id
    );
    const product = catalogProduct ?? {
      ...item.product,
      image: item.product.image.replace(/^\/assests\//, "/assets/"),
    };
    const existing = itemsById.get(product.id);

    itemsById.set(product.id, {
      product,
      quantity: (existing?.quantity ?? 0) + item.quantity,
    });
  }

  return Array.from(itemsById.values());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const storedCart = useStoredValue("drinko_cart", [], isStoredCart);
  const cart = useMemo(
    () => normalizeCart(storedCart.value),
    [storedCart.value]
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("iced-coffee");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saveCart = (newCart: CartItem[]) => {
    writeStoredValue("drinko_cart", normalizeCart(newCart));
  };

  useEffect(() => {
    if (
      storedCart.found &&
      JSON.stringify(storedCart.value) !== JSON.stringify(cart)
    ) {
      writeStoredValue("drinko_cart", cart);
    }
  }, [cart, storedCart.found, storedCart.value]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...cart, { product, quantity: 1 }];
    }
    saveCart(updated);
    showToast(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isVideoOpen,
        setIsVideoOpen,
        activeCategory,
        setActiveCategory,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
