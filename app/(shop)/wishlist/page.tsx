"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
          Loading Selections...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
          <Heart className="w-10 h-10 text-[var(--color-gold)] mx-auto animate-pulse" />
          <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase block">
            Bespoke Selections
          </span>
          <h1 className="text-4xl md:text-6xl font-display text-[var(--color-ivory)]">
            Your Wishlist
          </h1>
          <div className="h-[1px] w-24 bg-[var(--color-gold)] mx-auto my-4 opacity-50" />
          <p className="text-zinc-400 font-light text-sm leading-relaxed">
            Curate and review your favorited masterpieces here before acquiring them.
          </p>
        </div>

        <main className="mt-12">
          {items.length > 0 ? (
            <ProductGrid products={items} />
          ) : (
            <div className="text-center py-20 border border-zinc-900 bg-zinc-950/20 max-w-md mx-auto rounded-sm space-y-6">
              <p className="text-zinc-500 font-light tracking-wide text-sm">
                No items have been saved to your selections yet.
              </p>
              <Link href="/products" className="inline-block">
                <Button size="lg">
                  EXPLORE COLLECTIONS
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
