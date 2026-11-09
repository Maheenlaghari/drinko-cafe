"use client";

import React, { useState } from "react";
import { Truck, ShoppingBag, Clock, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function DeliveryPage() {
  const { setIsCartOpen, showToast } = useCart();
  const [postalCode, setPostalCode] = useState("");
  const [coverageChecked, setCoverageChecked] = useState(false);

  const handleCheckPostal = (e: React.FormEvent) => {
    e.preventDefault();
    if (postalCode.trim()) {
      setCoverageChecked(true);
      showToast("Drinko rapid delivery and takeaway are available in your area");
    }
  };

  return (
    <div className="w-full bg-[var(--color-bg)] py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase mb-3">
            <span>ORDER FULFILLMENT</span>
            <span className="w-8 h-[1.5px] bg-[var(--color-accent)] opacity-60 inline-block" />
          </div>

          <h1 className="font-drinko text-4xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight mb-4">
            <span>Delivery or Takeaway </span>
            <span className="text-[0.8em] not-italic font-bold uppercase text-[var(--color-accent)]">
              your choice
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
            Enjoy hand crafted specialty coffee delivered fresh to your door in
            temperature sealed packaging, or skip the wait with express
            counter pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] p-8 sm:p-10 flex flex-col justify-between hover:border-[var(--color-accent)]/50 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-soft)] border border-[var(--color-badge-border)] flex items-center justify-center text-[var(--color-accent)] mb-6">
                <Truck className="w-7 h-7" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-white border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text)] uppercase tracking-wider mb-3">
                Doorstep Delivery
              </div>

              <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight mb-3">
                Cold and Hot Express Delivery
              </h3>

              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
                Freshly extracted espresso and iced cold brews delivered in
                spill proof insulated containers with cold seal technology to
                preserve optimal micro foam and aroma.
              </p>

              <div className="space-y-3 pt-2 border-t border-[var(--color-border)]/60 text-xs text-[var(--color-text)] mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                  <span>Estimated delivery time: 25 to 35 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                  <span>Free delivery on orders over $30.00</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Order for Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] p-8 sm:p-10 flex flex-col justify-between hover:border-[var(--color-accent)]/50 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-soft)] border border-[var(--color-badge-border)] flex items-center justify-center text-[var(--color-accent)] mb-6">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-white border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text)] uppercase tracking-wider mb-3">
                Express Takeaway
              </div>

              <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight mb-3">
                Quick Counter Pickup
              </h3>

              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
                Order in advance from your phone, skip the queue, and collect
                your personalized craft pour ready at the designated pickup
                shelf at any of our four city locations.
              </p>

              <div className="space-y-3 pt-2 border-t border-[var(--color-border)]/60 text-xs text-[var(--color-text)] mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                  <span>Ready for pickup in 10 to 15 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                  <span>Zero delivery fee on all takeaway pickups</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Order for Takeaway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8 sm:p-10 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
            Check Delivery Coverage in Your Area
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-6">
            Enter your postal code to verify live courier dispatch availability.
          </p>

          <form
            onSubmit={handleCheckPostal}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal code"
              className="flex-1 px-4 py-3 rounded-full border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Check Availability
            </button>
          </form>

          {coverageChecked && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <Check className="w-4 h-4" />
              <span>
                Delivery and Takeaway are available for postal code {postalCode}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
