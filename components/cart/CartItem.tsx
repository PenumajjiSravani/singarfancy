"use client";

import { CartItem as CartItemType, useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-zinc-900 items-start">
      <div className="relative w-20 h-24 aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
        <Image
          src={item.product.images[0] || "/images/placeholder.jpg"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between h-24">
        <div>
          <h4 className="font-accent text-sm text-[var(--color-ivory)] line-clamp-1">
            {item.product.name}
          </h4>
          <span className="text-xs text-[var(--color-gold)] font-medium">
            {formatPrice(item.product.price)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center border border-zinc-800 rounded-sm">
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              className="px-2 py-1 text-zinc-400 hover:text-[var(--color-gold)] transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              className="px-2 py-1 text-zinc-400 hover:text-[var(--color-gold)] transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.product.id)}
            className="text-zinc-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
