"use client";

import React from "react";
import { MapPin, Clock, Phone, ShoppingBag, Coffee, ArrowRight } from "lucide-react";
import { storeLocationsData } from "@/data/menu-data";
import { useCart } from "@/context/cart-context";

export default function LocationsPage() {
  const { setIsCartOpen, showToast } = useCart();

  const handleSelectStore = (storeName: string) => {
    showToast(`Selected ${storeName} for takeaway pickup`);
    setIsCartOpen(true);
  };

  return (
    <div className="w-full bg-[var(--color-bg)] py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase mb-3">
            <span>OUR LOCATIONS</span>
            <span className="w-8 h-[1.5px] bg-[var(--color-accent)] opacity-60 inline-block" />
          </div>

          <h1 className="font-drinko text-4xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight mb-4">
            <span>Visit Our Cafes </span>
            <span className="text-[0.8em] not-italic font-bold uppercase text-[var(--color-accent)]">
              city roasteries
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
            Step into our warm architectural tasting rooms for manual pour
            overs, stone ground matcha, and fresh pastries, or grab your drink
            via our express takeaway shelves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {storeLocationsData.map((store) => (
            <div
              key={store.id}
              className="rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] p-8 sm:p-10 flex flex-col justify-between hover:border-[var(--color-accent)]/50 hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">
                      {store.name}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--color-accent)] mt-0.5">
                      {store.city}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-soft)] border border-[var(--color-badge-border)] flex items-center justify-center text-[var(--color-accent)] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-sm text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
                  <span>{store.address}</span>
                </p>

                <div className="space-y-3 pt-4 border-t border-[var(--color-border)]/60 text-xs text-[var(--color-text-muted)] mb-6">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[var(--color-text)] font-medium">
                        Monday to Friday: {store.hoursWeekday}
                      </span>
                      <span>Saturday to Sunday: {store.hoursWeekend}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                    <span className="text-[var(--color-text)] font-medium">
                      {store.phone}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {store.dineIn && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text)]">
                      <Coffee className="w-3 h-3 text-[var(--color-accent)]" />
                      <span>Dine In Available</span>
                    </span>
                  )}
                  {store.takeaway && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text)]">
                      <ShoppingBag className="w-3 h-3 text-[var(--color-accent)]" />
                      <span>Takeaway Counter</span>
                    </span>
                  )}
                  {store.deliveryAvailable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent-soft)] border border-[var(--color-badge-border)] text-[11px] font-semibold text-[var(--color-accent)]">
                      <span>Express Delivery Hub</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectStore(store.name)}
                className="w-full py-3.5 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Select for Takeaway Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
