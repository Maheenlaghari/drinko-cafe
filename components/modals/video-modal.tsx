"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function VideoModal() {
  const { isVideoOpen, setIsVideoOpen } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVideoOpen(false);
      }
    };
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVideoOpen, setIsVideoOpen]);

  if (!isVideoOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setIsVideoOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden bg-[#2b170e] shadow-2xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#321c13]">
          <h3 className="text-base font-semibold text-white">
            The Drinko Craft Pour Experience
          </h3>
          <button
            type="button"
            onClick={() => setIsVideoOpen(false)}
            className="p-1.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/fD3Q87hW77Y?autoplay=1"
            title="Drinko Coffee Experience"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
