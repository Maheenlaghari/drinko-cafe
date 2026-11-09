"use client";

import React, { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const { showToast } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email.trim(), name.trim());
      showToast("Signed in successfully");
    }
  };

  const handleDemoLogin = () => {
    login("sophia@drinko.coffee", "Sophia Martinez");
    showToast("Signed in as a new demo member");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setIsAuthModalOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[var(--color-bg)] p-6 sm:p-8 shadow-2xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            <Sparkles className="w-4 h-4" />
            <span>Drinko Coffee Club</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-full hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4 pb-2">
          <h3 className="font-drinko text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">
            Sign In or Join
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
            Order for delivery or takeaway, track every purchase, and receive a
            complimentary free coffee voucher after every 6 orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sophia Martinez"
              className="w-full px-4 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophia@drinko.coffee"
              className="w-full px-4 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs mt-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] hover:bg-[var(--color-accent)] hover:text-white text-[var(--color-accent)] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Instant Demo Sign In (5 Orders Progress)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
