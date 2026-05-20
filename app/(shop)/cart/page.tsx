"use client";

import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, getCartTotal } = useCartStore();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-display text-[var(--color-ivory)] mb-12 text-center md:text-left">
          Shopping Bag
        </h1>

        {items.length === 0 ? (
          <div className="py-20 text-center glass-card max-w-lg mx-auto p-8 rounded-sm">
            <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-6 stroke-[1.5]" />
            <h2 className="font-display text-2xl text-[var(--color-ivory)] mb-4">
              Your Bag is Empty
            </h2>
            <p className="text-zinc-500 font-light text-sm mb-8">
              Looks like you haven't added any elegant pieces yet. Explore our selections and discover items that speak to you.
            </p>
            <Link href="/products">
              <Button size="lg" className="w-full">
                EXPLORE COLLECTIONS
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* List */}
            <div className="lg:col-span-2 glass-card p-6 rounded-sm space-y-6">
              <h2 className="font-display text-2xl text-[var(--color-ivory)] border-b border-zinc-900 pb-4">
                Selected Pieces
              </h2>
              <div className="divide-y divide-zinc-900">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-6 rounded-sm bg-zinc-950/40 space-y-6">
              <h2 className="font-display text-2xl text-[var(--color-ivory)] border-b border-zinc-900 pb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Bag Subtotal</span>
                  <span className="text-[var(--color-ivory)] font-medium">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Estimated Shipping</span>
                  <span className="text-green-500 font-medium uppercase tracking-wider text-xs bg-green-950/20 px-2 py-0.5 border border-green-900/30 rounded-sm">
                    COMPLIMENTARY
                  </span>
                </div>
                <div className="flex justify-between border-t border-zinc-900 pt-4 text-base font-semibold">
                  <span className="text-[var(--color-ivory)]">Order Total</span>
                  <span className="text-[var(--color-gold)]">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full pt-4">
                <Button size="lg" className="w-full justify-center">
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
