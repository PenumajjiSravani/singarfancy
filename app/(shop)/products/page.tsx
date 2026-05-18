"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { useProductStore } from "@/store/productStore";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function ProductsCatalogContent() {
  const { products } = useProductStore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
          Loading Luxury Catalog...
        </div>
      </div>
    );
  }

  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "newest";
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "1000000");

  // Filtering dynamically based on user selections
  const filteredProducts = products.filter((product) => {
    if (activeCategory !== "all") {
      const categoryMatch = 
        product.category?.toLowerCase() === activeCategory.toLowerCase() ||
        product.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
        product.description.toLowerCase().includes(activeCategory.toLowerCase());
      if (!categoryMatch) return false;
    }
    
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }
    
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts];
  if (activeSort === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (activeSort === "newest") {
    sortedProducts.reverse();
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-display text-[var(--color-ivory)] mb-4">
            The Singar Collections
          </h1>
          <p className="text-zinc-400 font-light text-sm max-w-xl">
            Explore our curated masterpieces crafted with divine care. Filter by category or sorting style to find your perfect fit.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-32">
            <ProductFilters />
          </aside>

          {/* Product Grid */}
          <main className="w-full lg:w-3/4">
            {sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-20 border border-zinc-900 bg-zinc-950/20 rounded-sm">
                <p className="text-zinc-500 font-light uppercase tracking-widest text-xs">
                  No boutique acquisitions found in this classification.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
          Loading Luxury Catalog...
        </div>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}
