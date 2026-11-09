"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/menu/product-card";
import { productsData, categories } from "@/data/menu-data";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = productsData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[var(--color-bg)] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase mb-3">
            <span>OUR MENU</span>
            <span className="w-8 h-[1.5px] bg-[var(--color-accent)] opacity-60 inline-block" />
          </div>

          <h1 className="font-drinko text-4xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight mb-4">
            <span>Curated Menu </span>
            <span className="text-[0.8em] not-italic font-bold uppercase text-[var(--color-accent)]">
              craft pours
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
            Slow cold extractions, velvety espresso stained milk, sparkling
            botanical tonics, and fresh baked pastries.
          </p>

          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drinks and pastries"
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] shadow-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 scrollbar-none mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-xs"
                    : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)]">
            <p className="text-base font-semibold text-[var(--color-text)]">
              No matching beverages or bakery items found
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Try adjusting your search query or selecting another category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
