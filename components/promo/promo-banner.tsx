"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { promoBannerData } from "@/data/menu-data";
import { useCart } from "@/context/cart-context";

export function PromoBanner() {
  const { showToast } = useCart();
  const [copied, setCopied] = useState(false);

  const handleClaim = async () => {
    try {
      await navigator.clipboard.writeText(promoBannerData.code);
      setCopied(true);
      showToast(`Discount code ${promoBannerData.code} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(`Use discount code ${promoBannerData.code} at checkout`);
    }
  };

  return (
    <section className="w-full bg-[var(--color-bg)] pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[var(--color-promo-from)] via-[var(--color-promo-via)] to-[var(--color-promo-to)] p-6 sm:p-10 lg:p-12 border border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="max-w-xl z-10">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[var(--color-accent-deep)] uppercase mb-2">
              <span>{promoBannerData.badge}</span>
              <span className="w-8 h-[1.5px] bg-[var(--color-accent-deep)] opacity-60 inline-block" />
            </div>

            <h2 className="font-drinko text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight mb-2.5">
              {promoBannerData.headline}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-muted)] font-medium mb-6">
              Use code:{" "}
              <span className="font-bold text-[var(--color-text)]">
                {promoBannerData.code}
              </span>{" "}
              at checkout for a special discount.
            </p>

            <button
              type="button"
              onClick={handleClaim}
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <span>{copied ? "Code Copied" : promoBannerData.ctaText}</span>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 flex-shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#7E947F]/20 blur-xl" />
            <div
              className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center"
              style={{ position: "relative" }}
            >
              <Image
                src={promoBannerData.image}
                alt={promoBannerData.imageAlt}
                fill
                sizes="(max-width: 768px) 176px, 256px"
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
