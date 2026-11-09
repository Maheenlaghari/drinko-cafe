"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div className="product-card group relative rounded-[28px] bg-[var(--color-surface)] p-4 sm:p-5 flex flex-col justify-between border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:shadow-md transition-all duration-300">
      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden mb-4 rounded-2xl bg-white/40">
        <Image
          src={product.image}
          alt={product.name}
          width={320}
          height={320}
          className="object-contain w-4/5 h-4/5 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
        />
      </div>

      <div className="flex items-end justify-between pt-1">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text)] tracking-tight">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)] mt-0.5">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            justAdded
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] scale-110"
              : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] active:scale-95"
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {justAdded ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          )}
        </button>
      </div>
    </div>
  );
}
