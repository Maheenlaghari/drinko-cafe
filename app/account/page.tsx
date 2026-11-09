"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Check,
  Coffee,
  ShoppingBag,
  Truck,
  Copy,
  ArrowRight,
  LogOut,
  Calendar,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { productsData } from "@/data/menu-data";

export default function AccountPage() {
  const {
    user,
    login,
    logout,
    placeOrder,
    ordersRemainingForFreeCoffee,
  } = useAuth();
  const { showToast, setIsCartOpen } = useCart();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim()) {
      login(loginEmail.trim(), loginName.trim());
      showToast("Signed in to your Drinko account");
    }
  };

  const handleDemoSignIn = () => {
    login("sophia@drinko.coffee", "Sophia Martinez");
    showToast("Signed in as a new demo member");
  };

  const handleSimulateSixthOrder = () => {
    const { unlockedNewCoupon } = placeOrder({
      items: [{ product: productsData[0], quantity: 1 }],
      fulfillment: "takeaway",
      destination: "Downtown Flagship",
      subtotal: 6.5,
      deliveryFee: 0,
      discount: 0,
      total: 6.5,
    });

    if (unlockedNewCoupon) {
      showToast(
        "6th order completed! Free coffee coupon FREECOFFEE unlocked!"
      );
    } else {
      showToast("Test order placed successfully");
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(`Coupon code ${code} copied to clipboard`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (!user) {
    return (
      <div className="w-full bg-[var(--color-bg)] py-16 sm:py-24">
        <div className="max-w-md mx-auto px-6">
          <div className="rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] p-8 sm:p-10 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-[#3B5336] text-white flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Coffee className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B5336] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Drinko Coffee Club</span>
            </div>

            <h1 className="font-drinko text-[clamp(2rem,1.9vw,2.8rem)] leading-[0.8] tracking-[-0.06em] text-[#243621] mb-2">
              <span className="block">Sign In to</span>
            <span className="block">Your Account</span>

            </h1>

            <p className="text-xs sm:text-sm text-[#6C7D69] leading-relaxed mb-6">
              Track your deliveries and takeaway orders, and unlock a
              complimentary free coffee voucher after every 6 orders.
            </p>

            <form onSubmit={handleSignIn} className="space-y-3.5 text-left mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#243621] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Sophia Martinez"
                  className="w-full px-4 py-2.5 rounded-full border border-[var(--color-border)] bg-white text-sm text-[#243621] focus:outline-none focus:border-[#7E947F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243621] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="sophia@drinko.coffee"
                  className="w-full px-4 py-2.5 rounded-full border border-[var(--color-border)] bg-white text-sm text-[#243621] focus:outline-none focus:border-[#7E947F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#2D4228] hover:bg-[#20311D] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs mt-4"
              >
                <span>Sign In / Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2.5 rounded-full border border-[#7E947F]/40 bg-[#ECF2EA] hover:bg-[#3B5336] hover:text-white text-[#3B5336] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Instant Demo Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = user.orderCount;
  const stampsInCurrentCycle = completedCount % 6;
  const hasUnlockedFreeCoffee = user.unlockedCoupons.includes("FREECOFFEE");

  return (
    <div className="w-full bg-[var(--color-bg)] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B5336] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Loyalty Club Member</span>
            </div>
            <h1 className="font-drinko text-2xl sm:text-3xl font-bold text-[#243621] tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#6C7D69] mt-1">
              {user.email} &bull; {completedCount} Total Orders Placed
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              onClick={handleSimulateSixthOrder}
              className="px-4 py-2 rounded-full bg-[#2D4228] hover:bg-[#20311D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>Simulate Order (+1 Progress)</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[#6C7D69] hover:text-[#243621] transition-colors cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-[32px] bg-gradient-to-r from-[var(--color-promo-from)] via-[var(--color-promo-via)] to-[var(--color-promo-to)] p-6 sm:p-10 border border-[var(--color-border)] shadow-xs mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B5336] mb-1">
                <span>REWARDS PROGRESSION</span>
                <span className="w-6 h-[1.5px] bg-[#3B5336] opacity-60 inline-block" />
              </div>
              <h2 className="font-drinko text-xl sm:text-2xl font-bold text-[#243621] tracking-tight">
                Free Coffee Stamp Card
              </h2>
              <p className="text-xs sm:text-sm text-[#6C7D69] font-medium mt-1">
                {completedCount > 0 && ordersRemainingForFreeCoffee === 6
                  ? "Congratulations! You have completed a 6 orders cycle!"
                  : `Complete ${ordersRemainingForFreeCoffee} more ${
                      ordersRemainingForFreeCoffee === 1 ? "order" : "orders"
                    } to receive your complimentary free coffee voucher.`}
              </p>
            </div>

            <div className="px-4 py-2 rounded-full bg-white border border-[var(--color-border)] text-xs font-bold text-[#243621] shadow-2xs">
              <span>
                {stampsInCurrentCycle === 0 && completedCount > 0
                  ? "6 of 6 Stamps Completed"
                  : `${stampsInCurrentCycle} of 6 Stamps Completed`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6].map((stampIndex) => {
              const isFilled =
                stampsInCurrentCycle === 0 && completedCount > 0
                  ? true
                  : stampIndex <= stampsInCurrentCycle;
              const isRewardStamp = stampIndex === 6;

              return (
                <div
                  key={stampIndex}
                  className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all ${
                    isFilled
                      ? "bg-[#2D4228] text-white shadow-xs"
                      : "bg-white/80 border border-white text-[#6C7D69]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isFilled
                        ? "bg-[#7E947F] text-white"
                        : "bg-[var(--color-surface)] text-[#6C7D69] border border-[var(--color-border)]"
                    }`}
                  >
                    {isFilled ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Coffee className="w-4 h-4" />
                    )}
                  </div>

                  <span className="text-xs font-bold leading-tight">
                    {isRewardStamp ? "FREE COFFEE" : `Order ${stampIndex}`}
                  </span>
                  <span className="text-[10px] opacity-80 mt-0.5">
                    {isFilled ? "Earned" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {hasUnlockedFreeCoffee && (
          <div className="rounded-3xl bg-[var(--color-surface)] border border-[#7E947F]/40 p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3B5336] text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5336]">
                  Active Reward Voucher
                </span>
                <h3 className="text-xl font-bold text-[#243621]">
                  Complimentary Craft Coffee Voucher
                </h3>
                <p className="text-xs text-[#6C7D69] mt-0.5">
                  Redeemable for any iced cold brew, matcha latte, or espresso pour.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="px-4 py-2 rounded-xl bg-white border border-[var(--color-border)] font-mono font-bold text-sm text-[#3B5336]">
                FREECOFFEE
              </div>
              <button
                type="button"
                onClick={() => handleCopyCoupon("FREECOFFEE")}
                className="px-4 py-2 rounded-xl bg-[#2D4228] hover:bg-[#20311D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedCode ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#243621] tracking-tight">
                Order History
              </h2>
              <p className="text-xs text-[#6C7D69] mt-0.5">
                Detailed record of all your past delivery and takeaway purchases.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="text-xs font-semibold text-[#3B5336] hover:underline cursor-pointer"
            >
              Order Again
            </button>
          </div>

          <div className="space-y-4">
            {user.orders.length === 0 && (
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">
                <p className="text-sm font-semibold text-[#243621]">
                  No orders yet
                </p>
                <p className="mt-1 text-xs text-[#6C7D69]">
                  Your completed orders will appear here.
                </p>
              </div>
            )}
            {user.orders.map((ord) => (
              <div
                key={ord.id}
                className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 sm:p-6 hover:border-[#7E947F]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--color-border)]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[var(--color-border)]">
                      {ord.fulfillment === "delivery" ? (
                        <Truck className="w-5 h-5 text-[#3B5336]" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-[#3B5336]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#243621]">
                          {ord.id}
                        </span>
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#ECF2EA] text-[#3B5336] border border-[#D4E1D1]">
                          {ord.fulfillment}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6C7D69] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{ord.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{ord.destination}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="text-sm font-bold text-[#243621]">
                      ${ord.total.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-green-50 text-green-700 border border-green-200">
                      {ord.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ord.items.map((cartItem) => (
                    <div
                      key={cartItem.product.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[var(--color-border)]/50"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--color-surface)] flex items-center justify-center flex-shrink-0">
                        <Image
                          src={cartItem.product.image}
                          alt={cartItem.product.name}
                          width={40}
                          height={40}
                          className="object-contain w-8 h-8"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#243621] truncate">
                          {cartItem.product.name}
                        </p>
                        <p className="text-[11px] text-[#6C7D69]">
                          Qty: {cartItem.quantity} &bull; $
                          {cartItem.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
