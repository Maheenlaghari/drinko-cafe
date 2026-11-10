"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";
import { storeLocationsData } from "@/data/menu-data";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useStoredValue, writeStoredValue } from "@/context/storage";
import type {
  CheckoutPaymentMethod,
  CheckoutRequest,
  CheckoutResponse,
  FulfillmentType,
} from "@/types";

type PromoCode = "DRINKO20" | "FREECOFFEE";

function isFulfillmentType(value: unknown): value is FulfillmentType {
  return value === "delivery" || value === "takeaway";
}

function isPromoCode(value: unknown): value is PromoCode | null {
  return value === null || value === "DRINKO20" || value === "FREECOFFEE";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStoreName(value: unknown): value is string {
  return (
    typeof value === "string" &&
    storeLocationsData.some((store) => store.name === value)
  );
}

function isCheckoutResponse(value: unknown): value is CheckoutResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Partial<CheckoutResponse>;
  return (
    typeof response.orderId === "string" &&
    response.orderId.length > 0 &&
    (response.paymentStatus === "pending" || response.paymentStatus === "paid") &&
    (response.checkoutUrl === undefined ||
      typeof response.checkoutUrl === "string")
  );
}

function getErrorMessage(value: unknown) {
  if (typeof value !== "object" || value === null) return null;
  const message = (value as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message : null;
}

function getSecureCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

const fieldClassName =
  "w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[#243621] outline-none transition-colors focus:border-[#7E947F]";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [store, setStore] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("cash_on_delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const deliveryFee =
    fulfillment === "delivery" && subtotal > 0 && subtotal <= 30 ? 2.5 : 0;
  const discountAmount =
    appliedPromo === "DRINKO20"
      ? subtotal * 0.2
      : appliedPromo === "FREECOFFEE"
        ? Math.min(subtotal, 6.8)
        : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const cashPaymentMethod =
    fulfillment === "delivery" ? "cash_on_delivery" : "cash_on_pickup";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const checkoutRequest: CheckoutRequest = {
      customer: {
        name: name.trim() || user?.name.trim() || "",
        email: email.trim() || user?.email.trim() || "",
        phone: phone.trim(),
      },
      fulfillment,
      destination:
        fulfillment === "delivery"
          ? (address ?? deliveryAddress).trim()
          : store ?? selectedStore,
      items: cart.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
      paymentMethod:
        paymentMethod === "card" ? paymentMethod : cashPaymentMethod,
      ...(appliedPromo ? { promoCode: appliedPromo } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    let response: Response;
    try {
      response = await fetch(`${apiBaseUrl}/api/v1/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutRequest),
        cache: "no-store",
      });
    } catch {
      setErrorMessage(
        "We could not confirm your checkout response. Check your order status or contact support before trying again."
      );
      setIsSubmitting(false);
      return;
    }

    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }

    if (!response.ok) {
      setErrorMessage(
        getErrorMessage(responseBody) ??
          "Checkout could not be completed. Please review your details and try again."
      );
      setIsSubmitting(false);
      return;
    }

    if (!isCheckoutResponse(responseBody)) {
      setErrorMessage(
        "Checkout returned an invalid response. Please contact support before trying again."
      );
      setIsSubmitting(false);
      return;
    }

    if (paymentMethod === "card") {
      const checkoutUrl = responseBody.checkoutUrl
        ? getSecureCheckoutUrl(responseBody.checkoutUrl)
        : null;
      if (!checkoutUrl) {
        setErrorMessage(
          "A secure card checkout link was not returned. Your order status has not been confirmed. Contact support before trying again."
        );
        setIsSubmitting(false);
        return;
      }

      if (responseBody.paymentStatus !== "pending") {
        setErrorMessage(
          "Checkout returned an unexpected payment status. Contact support before trying again."
        );
        setIsSubmitting(false);
        return;
      }

      window.location.assign(checkoutUrl);
      return;
    }

    clearCart();
    writeStoredValue("drinko_checkout_promo", null);
    setConfirmedOrderId(responseBody.orderId);
    setIsSubmitting(false);
  };

  if (confirmedOrderId) {
    return (
      <section className="w-full bg-[var(--color-bg)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-xs sm:p-12">
          <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-[#3B5336]" />
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#3B5336]">
            Order received
          </p>
          <h1 className="font-drinko mb-3 text-3xl font-semibold text-[#243621] sm:text-4xl">
            Thank you for your order
          </h1>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            Your order number is{" "}
            <span className="font-semibold text-[#243621]">
              {confirmedOrderId}
            </span>
            .{" "}
            {fulfillment === "delivery"
              ? "Payment is due when your order arrives."
              : "Payment is due when you collect your order."}
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Continue browsing
          </Link>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="w-full bg-[var(--color-bg)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-xs sm:p-12">
          <ShoppingBag className="mx-auto mb-5 h-10 w-10 text-[#3B5336]" />
          <h1 className="font-drinko mb-3 text-3xl font-semibold text-[#243621]">
            Your cart is empty
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Add something from the menu before checking out.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Browse the menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[var(--color-bg)] px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/menu"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[#243621]"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#3B5336]">
            Almost yours
          </p>
          <h1 className="font-drinko text-3xl font-semibold text-[#243621] sm:text-4xl">
            Checkout
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
        >
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-semibold text-[#243621]">
                Contact details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-[#243621]">
                  Full name
                  <input
                    autoComplete="name"
                    className={fieldClassName}
                    maxLength={100}
                    onChange={(event) => setName(event.target.value)}
                    required
                    value={name || user?.name || ""}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-[#243621]">
                  Email address
                  <input
                    autoComplete="email"
                    className={fieldClassName}
                    maxLength={254}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type="email"
                    value={email || user?.email || ""}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-[#243621] sm:col-span-2">
                  Phone number
                  <input
                    autoComplete="tel"
                    className={fieldClassName}
                    maxLength={30}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    type="tel"
                    value={phone}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-semibold text-[#243621]">
                {fulfillment === "delivery" ? "Delivery address" : "Pickup location"}
              </h2>
              {fulfillment === "delivery" ? (
                <label className="space-y-2 text-sm font-medium text-[#243621]">
                  Street address
                  <input
                    autoComplete="street-address"
                    className={fieldClassName}
                    maxLength={300}
                    onChange={(event) => {
                      setAddress(event.target.value);
                      writeStoredValue("drinko_checkout_address", event.target.value);
                    }}
                    required
                    value={address ?? deliveryAddress}
                  />
                </label>
              ) : (
                <label className="space-y-2 text-sm font-medium text-[#243621]">
                  Store
                  <select
                    className={fieldClassName}
                    onChange={(event) => {
                      setStore(event.target.value);
                      writeStoredValue("drinko_checkout_store", event.target.value);
                    }}
                    value={store ?? selectedStore}
                  >
                    {storeLocationsData.map((location) => (
                      <option key={location.id} value={location.name}>
                        {location.name}, {location.address}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="mt-4 block space-y-2 text-sm font-medium text-[#243621]">
                Order notes
                <textarea
                  className={`${fieldClassName} min-h-24 resize-y`}
                  maxLength={500}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional instructions for your order"
                  value={notes}
                />
              </label>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-semibold text-[#243621]">
                Payment method
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <PaymentOption
                  description={
                    fulfillment === "delivery"
                      ? "Pay when your order arrives"
                      : "Pay when you collect your order"
                  }
                  icon={<Banknote className="h-5 w-5" />}
                  isSelected={paymentMethod !== "card"}
                  label={
                    fulfillment === "delivery"
                      ? "Cash on delivery"
                      : "Cash at pickup"
                  }
                  onSelect={() => setPaymentMethod(cashPaymentMethod)}
                />
                <PaymentOption
                  description="Continue to secure card payment"
                  icon={<CreditCard className="h-5 w-5" />}
                  isSelected={paymentMethod === "card"}
                  label="Credit or debit card"
                  onSelect={() => setPaymentMethod("card")}
                />
              </div>
              {paymentMethod === "card" && (
                <p className="mt-4 flex items-start gap-2 rounded-2xl border border-[var(--color-border)] bg-white p-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#3B5336]" />
                  Card details are entered on the payment provider page. This
                  site does not collect or store card numbers.
                </p>
              )}
            </section>
          </div>

          <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xs sm:p-8 lg:sticky lg:top-28">
            <h2 className="mb-5 text-lg font-semibold text-[#243621]">
              Order summary
            </h2>
            <div className="mb-5 space-y-4">
              {cart.map(({ product, quantity }) => (
                <div className="flex items-center gap-3" key={product.id}>
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
                    <Image
                      alt={product.name}
                      className="object-contain p-1"
                      fill
                      sizes="56px"
                      src={product.image}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#243621]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Qty {quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#243621]">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-[var(--color-border)] pt-4 text-sm">
              <SummaryLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryLine
                label="Delivery"
                value={
                  deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`
                }
              />
              {appliedPromo && (
                <SummaryLine
                  label={`Discount (${appliedPromo})`}
                  value={`−$${discountAmount.toFixed(2)}`}
                />
              )}
              <div className="flex justify-between border-t border-[var(--color-border)] pt-3 font-semibold text-[#243621]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {errorMessage && (
              <p
                className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? "Processing"
                : paymentMethod === "card"
                  ? "Continue to secure payment"
                  : "Place order"}
            </button>
            <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
              Final price and availability are confirmed by the checkout service.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function PaymentOption({
  description,
  icon,
  isSelected,
  label,
  onSelect,
}: {
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={isSelected}
      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        isSelected
          ? "border-[#3B5336] bg-white ring-1 ring-[#3B5336]"
          : "border-[var(--color-border)] bg-white/60 hover:bg-white"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="mt-0.5 text-[#3B5336]">{icon}</span>
      <span>
        <span className="block text-sm font-semibold text-[#243621]">
          {label}
        </span>
        <span className="mt-1 block text-xs text-[var(--color-text-muted)]">
          {description}
        </span>
      </span>
    </button>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[var(--color-text-muted)]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
