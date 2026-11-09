"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import { productsData, categories } from "@/data/menu-data";
import { useCart } from "@/context/cart-context";

export function MenuSection() {
  const { activeCategory, setActiveCategory } = useCart();
  const [showAllItems, setShowAllItems] = useState(false);

  const filterCategories = categories.filter((c) => c.slug !== "all");

  const filteredProducts = showAllItems
    ? productsData
    : productsData.filter((item) => {
        if (!activeCategory || activeCategory === "all") return true;
        return item.category === activeCategory;
      });

  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : productsData;

  const toggleViewAll = () => {
    setShowAllItems(!showAllItems);
    if (!showAllItems) {
      setActiveCategory("all");
    } else {
      setActiveCategory("iced-coffee");
    }
  };

  return (
    <section id="menu" className="w-full bg-[var(--color-bg)] pt-8 pb-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#3B5336] uppercase mb-2">
              <span>OUR MENU</span>
              <span className="w-8 h-[1.5px] bg-[#3B5336] opacity-60 inline-block" />
            </div>

            <h2 className="font-drinko text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight">
              <span>Curated Menu </span>
              <span className="text-[0.8em] not-italic font-bold uppercase text-[#7E947F]">
                craft pours
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={toggleViewAll}
            className="inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--color-text)] hover:text-[#7E947F] transition-colors group self-start md:self-auto cursor-pointer"
          >
            <span>{showAllItems ? "Curated View" : "View All"}</span>
            <span className="w-6 h-6 rounded-full border border-[var(--color-text)] group-hover:border-[#7E947F] flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 scrollbar-none mb-8">
          {filterCategories.map((category) => {
            const isActive =
              !showAllItems && activeCategory === category.slug;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setShowAllItems(false);
                  setActiveCategory(category.slug);
                }}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#2D4228] text-white shadow-xs"
                    : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[#7E947F]/40"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
