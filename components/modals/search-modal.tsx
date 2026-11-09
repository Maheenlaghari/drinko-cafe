"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { productsData } from "@/data/menu-data";

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useCart();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = productsData.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-20 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden bg-[var(--color-bg)] shadow-2xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 w-full mr-4">
            <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search drinks and pastries"
              autoFocus
              className="w-full bg-transparent text-base sm:text-lg text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-full hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto mt-4 space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
              No items match your search
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-xl bg-white/60 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-contain w-10 h-10"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-text)]">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="w-8 h-8 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
