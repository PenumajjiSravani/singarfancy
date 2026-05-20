"use client";

import { useCartStore } from "@/store/cartStore";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm glass-card p-8 rounded-sm">
          <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-6" />
          <h2 className="font-display text-2xl text-[var(--color-ivory)] mb-4">Your Bag is Empty</h2>
          <p className="text-zinc-500 font-light text-sm mb-6">You cannot check out without placing luxury pieces in your bag.</p>
          <Link href="/products" className="inline-block w-full">
            <button className="w-full bg-[var(--color-gold)] text-black font-semibold py-3 hover:bg-[var(--color-gold-hover)] transition-colors">
              SHOP NOW
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-display text-[var(--color-ivory)] mb-12 text-center md:text-left">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Checkout Steps Column */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Sidebar Summary */}
          <div className="glass-card p-6 rounded-sm bg-zinc-950/40 space-y-6 lg:sticky lg:top-32">
            <h3 className="font-display text-xl text-[var(--color-ivory)] border-b border-zinc-900 pb-4">
              Your Selection
            </h3>

            {/* Selected Items Scrollable List */}
            <div className="divide-y divide-zinc-900 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 py-4 items-center">
                  <div className="relative w-12 h-16 aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/images/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-accent text-xs text-[var(--color-ivory)] truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-zinc-500 font-light">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--color-gold)] font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-zinc-900 pt-4 space-y-3 text-xs font-light">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-zinc-300 font-medium">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span className="text-zinc-300 font-medium uppercase tracking-wider text-[10px]">
                  COMPLIMENTARY
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-900 pt-3 text-sm font-semibold">
                <span className="text-[var(--color-ivory)]">Order Total</span>
                <span className="text-[var(--color-gold)]">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
