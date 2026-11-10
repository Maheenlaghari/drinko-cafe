"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { navigationItems } from "@/data/menu-data";

export function Navbar() {
  const pathname = usePathname();
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header
      className={`site-navbar sticky top-0 z-40 w-full border-b border-[var(--color-border)]/60 ${
        isScrolled ? "is-scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" aria-label="Drinko home" className="flex items-center">
          <span className="brand-wordmark navbar-brand-wordmark">
            DRINKO
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? "text-[#243621] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3B5336]"
                    : "text-[#6C7D69] hover:text-[#243621]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 text-[#243621] hover:text-[#3B5336] transition-colors duration-200 cursor-pointer"
            aria-label="Search drinks"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 text-[#243621] hover:text-[#3B5336] transition-colors duration-200 cursor-pointer"
            aria-label={`Shopping bag, ${totalCount} ${
              totalCount === 1 ? "item" : "items"
            }`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {totalCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3B5336] px-1 text-[10px] font-bold leading-none text-white shadow-xs"
              >
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </button>

          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 p-1.5 text-[#243621] hover:text-[#3B5336] transition-colors duration-200"
              aria-label="Account page"
            >
              <div className="w-6 h-6 rounded-full bg-[#ECF2EA] border border-[#D4E1D1] flex items-center justify-center text-[#3B5336] text-xs font-bold">
                {user.name.charAt(0)}
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="p-1.5 text-[#243621] hover:text-[#3B5336] transition-colors duration-200 cursor-pointer"
              aria-label="Sign in"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#243621] hover:text-[#3B5336] transition-colors duration-200 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.8]" />
            ) : (
              <MenuIcon className="w-5 h-5 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white px-6 py-4 flex flex-col gap-3 shadow-lg">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#3B5336] font-semibold"
                    : "text-[#243621]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
