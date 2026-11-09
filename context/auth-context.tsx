"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserProfile, Order, CartItem, FulfillmentType } from "@/types";
import { useStoredValue, writeStoredValue } from "@/context/storage";

interface AuthContextType {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  placeOrder: (params: {
    items: CartItem[];
    fulfillment: FulfillmentType;
    destination: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  }) => { order: Order; unlockedNewCoupon: boolean };
  ordersRemainingForFreeCoffee: number;
}

function isStoredUser(value: unknown): value is UserProfile | null {
  if (value === null) return true;
  if (typeof value !== "object") return false;

  const profile = value as UserProfile;
  return (
    typeof profile.id === "string" &&
    typeof profile.name === "string" &&
    typeof profile.email === "string" &&
    Number.isInteger(profile.orderCount) &&
    profile.orderCount >= 0 &&
    Array.isArray(profile.unlockedCoupons) &&
    profile.unlockedCoupons.every((coupon) => typeof coupon === "string") &&
    Array.isArray(profile.orders) &&
    profile.orders.every(isStoredOrder)
  );
}

function isLegacyDemoUser(user: UserProfile | null) {
  const demoOrderIds = ["ORD8901", "ORD8902", "ORD8903", "ORD8904", "ORD8905"];

  return (
    user?.id === "usr101" &&
    user.email === "sophia@drinko.coffee" &&
    user.orderCount === 5 &&
    user.orders.length === demoOrderIds.length &&
    demoOrderIds.every((id) => user.orders.some((order) => order.id === id))
  );
}

function isStoredOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;

  const order = value as Order;
  return (
    typeof order.id === "string" &&
    (order.fulfillment === "delivery" || order.fulfillment === "takeaway") &&
    typeof order.destination === "string" &&
    [order.subtotal, order.deliveryFee, order.discount, order.total].every(
      (amount) => typeof amount === "number" && Number.isFinite(amount)
    ) &&
    typeof order.date === "string" &&
    ["preparing", "ready", "delivered", "completed"].includes(order.status) &&
    Array.isArray(order.items) &&
    order.items.every(
      (item) =>
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        typeof item.product?.id === "string" &&
        typeof item.product.name === "string" &&
        typeof item.product.price === "number"
    )
  );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedUser = useStoredValue(
    "drinko_user_profile",
    null,
    isStoredUser
  );
  const isLegacyDemo = isLegacyDemoUser(storedUser.value);
  const user = isLegacyDemo ? null : storedUser.value;

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isLegacyDemo) writeStoredValue("drinko_user_profile", null);
  }, [isLegacyDemo]);

  const saveUser = (updatedUser: UserProfile | null) => {
    writeStoredValue("drinko_user_profile", updatedUser);
  };

  const login = (email: string, name?: string) => {
    const formattedName =
      name && name.trim() ? name.trim() : email.split("@")[0];
    const newUser: UserProfile = user
      ? { ...user, email, name: formattedName }
      : {
          id: `usr${Date.now()}`,
          name: formattedName,
          email,
          orderCount: 0,
          unlockedCoupons: [],
          orders: [],
        };
    saveUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    saveUser(null);
  };

  const placeOrder = ({
    items,
    fulfillment,
    destination,
    subtotal,
    deliveryFee,
    discount,
    total,
  }: {
    items: CartItem[];
    fulfillment: FulfillmentType;
    destination: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  }) => {
    const newOrderId = `ORD${Math.floor(1000 + Math.random() * 9000)}`;
    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());

    const newOrder: Order = {
      id: newOrderId,
      items,
      fulfillment,
      destination,
      subtotal,
      deliveryFee,
      discount,
      total,
      date: dateFormatted,
      status: "preparing",
    };

    let currentUser = user;
    if (!currentUser) {
      currentUser = {
        id: `usr${Date.now()}`,
        name: "Coffee Guest",
        email: "guest@drinko.coffee",
        orderCount: 0,
        unlockedCoupons: [],
        orders: [],
      };
    }

    const nextCount = currentUser.orderCount + 1;
    let unlockedNewCoupon = false;
    const updatedCoupons = [...currentUser.unlockedCoupons];

    if (nextCount % 6 === 0) {
      unlockedNewCoupon = true;
      if (!updatedCoupons.includes("FREECOFFEE")) {
        updatedCoupons.push("FREECOFFEE");
      }
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      orderCount: nextCount,
      unlockedCoupons: updatedCoupons,
      orders: [newOrder, ...currentUser.orders],
    };

    saveUser(updatedUser);
    return { order: newOrder, unlockedNewCoupon };
  };

  const currentCount = user ? user.orderCount : 0;
  const modSix = currentCount % 6;
  const ordersRemainingForFreeCoffee = modSix === 0 ? 6 : 6 - modSix;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        placeOrder,
        ordersRemainingForFreeCoffee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
