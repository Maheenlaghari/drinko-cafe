"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { navigationItems } from "@/data/menu-data";

export function Footer() {
  const { showToast } = useCart();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast("Thank you for subscribing to Drinko drops");
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-[var(--color-bg)] pt-16 pb-12 text-[var(--color-text)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Link href="/" aria-label="Drinko home" className="mb-10 block">
          <span className="brand-wordmark brand-wordmark-footer block leading-[0.72]">
            DRINKO
          </span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
              Crafted with care, served with love. Ceremonial stone ground
              matcha, single origin craft pours, and botanical infusions
              anytime, anywhere.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-deep)]">
              <span>STONE GROUND MATCHA</span>
              <span className="inline-block h-[1.5px] w-6 bg-[var(--color-accent-deep)] opacity-60" />
              <span>CRAFT POURS</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              Hours
            </h4>
            <div className="space-y-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
              <div>
                <span className="block font-medium text-[var(--color-text)]">
                  Monday to Friday
                </span>
                <span>7:00 AM to 8:00 PM</span>
              </div>
              <div>
                <span className="block font-medium text-[var(--color-text)]">
                  Saturday to Sunday
                </span>
                <span>8:00 AM to 9:00 PM</span>
              </div>
              <div className="pt-1">
                <span className="block font-medium text-[var(--color-text)]">
                  Matcha Ceremony
                </span>
                <span>Every Thursday 5:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              Newsletter
            </h4>
            <p className="mb-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Get secret drops, seasonal roasts, and special tasting invites.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
                {subscribed ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-[var(--color-text-muted)] sm:flex-row">
          <p>2026 Drinko Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
