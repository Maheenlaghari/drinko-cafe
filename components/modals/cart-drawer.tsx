"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { storeLocationsData } from "@/data/menu-data";
import type { FulfillmentType } from "@/types";
import { useStoredValue, writeStoredValue } from "@/context/storage";
import { useRouter } from "next/navigation";

type PromoCode = "DRINKO20" | "FREECOFFEE";

function isPromoCode(value: unknown): value is PromoCode | null {
  return value === null || value === "DRINKO20" || value === "FREECOFFEE";
}

function isFulfillmentType(value: unknown): value is FulfillmentType {
  return value === "delivery" || value === "takeaway";
}

function isStoreName(value: unknown): value is string {
  return (
    typeof value === "string" &&
    storeLocationsData.some((store) => store.name === value)
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    showToast,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const fulfillment = useStoredValue<FulfillmentType>(
    "drinko_checkout_fulfillment",
    "delivery",
    isFulfillmentType
  ).value;
  const selectedStore = useStoredValue(
    "drinko_checkout_store",
    storeLocationsData[0].name,
    isStoreName
  ).value;
  const deliveryAddress = useStoredValue(
    "drinko_checkout_address",
    "",
    isString
  ).value;
  const appliedPromo = useStoredValue<PromoCode | null>(
    "drinko_checkout_promo",
    null,
    isPromoCode
  ).value;
  const [discountCode, setDiscountCode] = useState("");

  const handleFulfillmentChange = (type: FulfillmentType) => {
    writeStoredValue("drinko_checkout_fulfillment", type);
  };

  const handleStoreChange = (store: string) => {
    writeStoredValue("drinko_checkout_store", store);
  };

  const handleAddressChange = (addr: string) => {
    writeStoredValue("drinko_checkout_address", addr);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (code === "DRINKO20") {
      writeStoredValue("drinko_checkout_promo", "DRINKO20");
      showToast("Discount of 20 percent applied");
    } else if (code === "FREECOFFEE") {
      writeStoredValue("drinko_checkout_promo", "FREECOFFEE");
      showToast("Free coffee voucher applied");
    } else {
      showToast("Invalid promo code");
    }
  };

  const deliveryFee =
    fulfillment === "delivery" ? (subtotal > 30 ? 0 : 2.5) : 0;

  let discountAmount = 0;
  if (appliedPromo === "DRINKO20") {
    discountAmount = subtotal * 0.2;
  } else if (appliedPromo === "FREECOFFEE") {
    discountAmount = Math.min(subtotal, 6.8);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[var(--color-border)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#243621]">
                Your Order
              </h2>
              {user && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECF2EA] text-[#3B5336] font-semibold border border-[#D4E1D1]">
                  {user.orderCount} Orders Completed
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#6C7D69] hover:text-[#243621] rounded-full hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <>
              <div className="px-6 pt-4 pb-2 border-b border-[var(--color-border)]/60 bg-[var(--color-surface)]">
                <label className="block text-xs font-bold text-[#243621] mb-2 uppercase tracking-wider">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-white border border-[var(--color-border)] mb-3">
                  <button
                    type="button"
                    onClick={() => handleFulfillmentChange("delivery")}
                    className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      fulfillment === "delivery"
                        ? "bg-[#2D4228] text-white shadow-xs"
                        : "text-[#6C7D69] hover:text-[#243621]"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFulfillmentChange("takeaway")}
                    className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      fulfillment === "takeaway"
                        ? "bg-[#2D4228] text-white shadow-xs"
                        : "text-[#6C7D69] hover:text-[#243621]"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Takeaway</span>
                  </button>
                </div>

                {fulfillment === "delivery" ? (
                  <div className="pb-2 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] text-[#6C7D69]">
                      <span>Delivery address</span>
                      <span>25 to 35 minutes</span>
                    </div>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="Enter street and unit number"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-white text-[#243621] focus:outline-none focus:border-[#7E947F]"
                    />
                  </div>
                ) : (
                  <div className="pb-2 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] text-[#6C7D69]">
                      <span>Pickup location</span>
                      <span>10 to 15 minutes</span>
                    </div>
                    <select
                      value={selectedStore}
                      onChange={(e) => handleStoreChange(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-white text-[#243621] focus:outline-none focus:border-[#7E947F] cursor-pointer"
                    >
                      {storeLocationsData.map((store) => (
                        <option key={store.id} value={store.name}>
                          {store.name} ({store.address})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
                {cart.length === 0 ? (
                  <div className="py-20 text-center text-sm text-[#6C7D69]">
                    Your cart is currently empty
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden flex items-center justify-center flex-shrink-0 border border-[var(--color-border)]/50">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="object-contain w-10 h-10"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#243621] leading-snug">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-[#6C7D69] mt-0.5">
                            ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[#243621] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#243621] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[#243621] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-1 p-1 text-[#6C7D69] hover:text-red-700 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Code DRINKO20 or FREECOFFEE"
                      className="flex-1 px-3.5 py-2 text-xs rounded-full border border-[var(--color-border)] bg-white text-[#243621] focus:outline-none focus:border-[#7E947F]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold rounded-full bg-[#2D4228] text-white hover:bg-[#20311D] cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  <div className="space-y-1.5 text-xs text-[#6C7D69]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>
                        {fulfillment === "delivery"
                          ? "Delivery Fee"
                          : "Takeaway Pickup Fee"}
                      </span>
                      <span>
                        {deliveryFee === 0
                          ? "Free"
                          : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-[#3B5336] font-semibold">
                        <span>Discount ({appliedPromo})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-bold text-[#243621] pt-2 border-t border-[var(--color-border)]">
                      <span>Total ({fulfillment})</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-full bg-[#2D4228] hover:bg-[#20311D] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>Continue to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
          </>
        </div>
      </div>
    </div>
  );
}
