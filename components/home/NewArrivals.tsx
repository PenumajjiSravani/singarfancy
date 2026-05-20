"use client";

import { motion } from "framer-motion";
import { ProductCard, Product } from "@/components/product/ProductCard";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const mockNewArrivals: Product[] = [
  {
    id: "1",
    name: "Golden Royale Necklace",
    slug: "golden-royale-necklace",
    description: "A gorgeous 24k gold plated necklace with embedded champagne diamonds.",
    price: 12500,
    comparePrice: 18000,
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"],
    stock: 5,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Emperor Gold Ring",
    slug: "emperor-gold-ring",
    description: "Imperial gold band with detailed hand engraving.",
    price: 8900,
    comparePrice: 12000,
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"],
    stock: 10,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Blush Rose Lip Oil",
    slug: "blush-rose-lip-oil",
    description: "Nourishing, high-shine oil made from organic damask rose petals.",
    price: 1800,
    comparePrice: 2500,
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop"],
    stock: 25,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Starlight Diamond Studs",
    slug: "starlight-diamond-studs",
    description: "18k white gold studs featuring brilliant round cut conflict-free diamonds.",
    price: 24500,
    comparePrice: null,
    images: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop"],
    stock: 3,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Midnight Silk Scarf",
    slug: "midnight-silk-scarf",
    description: "100% mulberry silk scarf featuring an editorial celestial print.",
    price: 3500,
    comparePrice: 5000,
    images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop"],
    stock: 12,
    isFeatured: true,
  },
];

export function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-[#080808] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase mb-3 block">
              Just In
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-[var(--color-ivory)]">
              The New Arrivals
            </h2>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--color-ivory)] hover:text-black hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--color-ivory)] hover:text-black hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {mockNewArrivals.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] max-w-[360px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
