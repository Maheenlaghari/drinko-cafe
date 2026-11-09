"use client";

import React from "react";
import { Check } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-[#2D4228] text-white text-xs sm:text-sm font-medium shadow-xl border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
      <div className="w-5 h-5 rounded-full bg-[#7E947F] flex items-center justify-center flex-shrink-0">
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
      <span>{toastMessage}</span>
    </div>
  );
}
