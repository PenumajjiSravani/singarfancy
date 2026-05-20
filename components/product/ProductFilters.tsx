"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const categories = [
  { name: "All Collections", value: "all" },
  { name: "Jewelry", value: "jewelry" },
  { name: "Accessories", value: "accessories" },
  { name: "Cosmetics", value: "cosmetics" },
  { name: "Watches", value: "watches" },
];

const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "0";
  const currentMaxPrice = searchParams.get("maxPrice") || "100000";

  const [priceRange, setPriceRange] = useState({
    min: parseInt(currentMinPrice),
    max: parseInt(currentMaxPrice),
  });

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = e.target.value;
    setPriceRange((prev) => ({ ...prev, [type]: parseInt(value) || 0 }));
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceRange.min.toString());
    params.set("maxPrice", priceRange.max.toString());
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  return (
    <div className="glass-card p-6 rounded-sm w-full space-y-8">
      {/* Category Section */}
      <div>
        <h3 className="font-display text-lg text-[var(--color-ivory)] mb-4 tracking-wide uppercase border-b border-zinc-900 pb-2">
          Categories
        </h3>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilter("category", cat.value)}
              className={`text-left text-sm transition-all duration-300 font-light hover:text-[var(--color-gold)] hover:pl-2 ${
                currentCategory === cat.value
                  ? "text-[var(--color-gold)] font-medium pl-2 border-l border-[var(--color-gold)]"
                  : "text-zinc-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting Section */}
      <div>
        <h3 className="font-display text-lg text-[var(--color-ivory)] mb-4 tracking-wide uppercase border-b border-zinc-900 pb-2">
          Sort By
        </h3>
        <div className="flex flex-col gap-3">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sort", option.value)}
              className={`text-left text-sm transition-all duration-300 font-light hover:text-[var(--color-gold)] ${
                currentSort === option.value
                  ? "text-[var(--color-gold)] font-medium"
                  : "text-zinc-400"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h3 className="font-display text-lg text-[var(--color-ivory)] mb-4 tracking-wide uppercase border-b border-zinc-900 pb-2">
          Price Range (INR)
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 block mb-1">Min</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-full bg-zinc-950 border border-zinc-800 text-sm px-3 py-2 text-[var(--color-ivory)] focus:border-[var(--color-gold)] outline-none transition-colors rounded-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500 block mb-1">Max</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-full bg-zinc-950 border border-zinc-800 text-sm px-3 py-2 text-[var(--color-ivory)] focus:border-[var(--color-gold)] outline-none transition-colors rounded-none"
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            disabled={isPending}
            className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-semibold tracking-wider text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black transition-colors rounded-none uppercase"
          >
            Apply Price
          </button>
        </div>
      </div>
    </div>
  );
}
