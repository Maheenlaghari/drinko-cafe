import { Star } from "lucide-react";
import { HeroSection } from "@/components/hero/hero-section";
import { MenuSection } from "@/components/menu/menu-section";
import { PromoBanner } from "@/components/promo/promo-banner";

const reviews = [
  {
    name: "Leah M.",
    role: "Daily regular",
    quote:
      "The iced matcha here tastes as refined as a boutique café and the service is effortlessly warm.",
    rating: 5,
  },
  {
    name: "Daniel T.",
    role: "Remote worker",
    quote:
      "Clean design, strong coffee, and the perfect midday reset. It feels premium without trying too hard.",
    rating: 5,
  },
  {
    name: "Sofia R.",
    role: "Weekend brunch guest",
    quote:
      "Everything lands perfectly balanced. The oat latte and pastry pairing is genuinely worth the stop.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <MenuSection />

      <section className="w-full bg-[var(--color-bg)] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3B5336]">
                <span>Customer Love</span>
                <span className="h-px w-8 bg-[#3B5336] opacity-60" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.06em] text-[#243621]">
                Loved by regulars and first timers
              </h2>
            </div>
            <p className="max-w-xl text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
              Thoughtful brews, consistent service, and a calm café rhythm that keeps people coming back.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="review-card flex h-full flex-col rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xs"
              >
                <div className="mb-4 flex items-center gap-1 text-[#C7A552]">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={`${review.name}-${index}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="flex-1 text-base leading-relaxed text-[#243621]">
                  “{review.quote}”
                </p>

                <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                  <p className="text-sm font-semibold text-[#243621]">{review.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    {review.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PromoBanner />
    </>
  );
}
