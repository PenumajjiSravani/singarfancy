"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { notFound } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import { useState, useEffect, use } from "react";

// Curated Category Details Map
const categoryDetails: Record<string, { title: string; subtitle: string; keywords: string[] }> = {
  jewelry: {
    title: "Fine Jewelry Masterpieces",
    subtitle: "Magnificent necklaces, exquisite bands, and brilliant conflict-free diamond studs crafted in pure gold.",
    keywords: ["jewelry", "necklace", "ring", "studs", "earrings", "diamonds", "gold"],
  },
  accessories: {
    title: "Royal Accessories",
    subtitle: "Complete your elite collection with premium hand-woven silk scarves and gold chronograph chronos.",
    keywords: ["accessories", "scarf", "timepiece", "gold", "ring", "necklace"],
  },
  cosmetics: {
    title: "Elite Beauty & Cosmetics",
    subtitle: "Luxurious velvet liquid lip glazes and nourishing gold-infusion botanical flower oils.",
    keywords: ["cosmetics", "lip", "glaze", "oil", "velvet", "blush"],
  },
  watches: {
    title: "Curated Timepieces",
    subtitle: "Masterpiece chronograph luxury timekeepers with premium details.",
    keywords: ["timepiece", "watch", "chrono"],
  },
  handbags: {
    title: "Bespoke Carryalls & Handbags",
    subtitle: "Exotic premium leather handbags curated for high society.",
    keywords: ["bag", "handbag", "carryall"],
  },
};

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const lowerSlug = slug.toLowerCase();
  const { products } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
          Opening Category Portal...
        </div>
      </div>
    );
  }

  const categoryInfo = categoryDetails[lowerSlug];
  
  if (!categoryInfo) {
    notFound();
  }

  // Filter products by dynamic store values
  const filteredProducts = products.filter((product) => {
    // Direct category name check or keyword search
    const matchesCategoryName = product.category?.toLowerCase().includes(lowerSlug) || 
                                lowerSlug.includes(product.category?.toLowerCase() || "");
    
    if (matchesCategoryName) return true;

    // Fallback keyword search
    return categoryInfo.keywords.some((keyword) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.category?.toLowerCase().includes(keyword)
      );
    });
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase block">
            Signature Curation
          </span>
          <h1 className="text-4xl md:text-6xl font-display text-[var(--color-ivory)]">
            {categoryInfo.title}
          </h1>
          <div className="h-[1px] w-24 bg-[var(--color-gold)] mx-auto my-4 opacity-50" />
          <p className="text-zinc-400 font-light text-sm leading-relaxed">
            {categoryInfo.subtitle}
          </p>
        </div>

        <main className="mt-12">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-20 border border-zinc-900 bg-zinc-950/20 max-w-md mx-auto rounded-sm space-y-4">
              <p className="text-zinc-500 font-light tracking-wide">No active curations in this tier right now.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
