"use client";

import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { X, ShoppingBag } from "lucide-react";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, getCartTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-[#0A0A0A] border-l border-zinc-900 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[var(--color-gold)]" />
                <h3 className="font-display text-xl text-[var(--color-ivory)]">YOUR SHOPPING BAG</h3>
                <span className="bg-zinc-900 text-zinc-400 text-xs px-2 py-0.5 rounded-full border border-zinc-800">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-zinc-400 hover:text-[var(--color-gold)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center gap-6">
                  <ShoppingBag className="w-16 h-16 text-zinc-700 stroke-[1.5]" />
                  <div>
                    <h4 className="font-display text-lg text-[var(--color-ivory)] mb-2">YOUR BAG IS EMPTY</h4>
                    <p className="text-zinc-500 text-sm max-w-[250px] mx-auto">
                      Explore our collections and add exquisite pieces to your wardrobe.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={closeCart} className="mt-4">
                    CONTINUE SHOPPING
                  </Button>
                </div>
              ) : (
                items.map((item) => <CartItem key={item.product.id} item={item} />)
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-900 bg-zinc-950/40">
                <div className="flex justify-between mb-4">
                  <span className="text-zinc-400 text-sm">Subtotal</span>
                  <span className="text-[var(--color-gold)] font-semibold text-lg">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-zinc-400 text-sm">Estimated Shipping</span>
                  <span className="text-[var(--color-ivory)] font-medium text-sm uppercase tracking-wider text-xs bg-zinc-900 px-2.5 py-1 border border-zinc-800 rounded-sm">
                    COMPLIMENTARY
                  </span>
                </div>
                
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button variant="primary" size="lg" className="w-full text-center py-4 rounded-none font-bold text-sm tracking-widest uppercase">
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>
                
                <button
                  onClick={closeCart}
                  className="w-full text-center text-zinc-500 hover:text-[var(--color-gold)] text-xs tracking-wider uppercase mt-4 transition-colors font-semibold"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
