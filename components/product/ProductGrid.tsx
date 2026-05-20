"use client";

import { ProductCard, Product } from "./ProductCard";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-sm">
        <h3 className="font-display text-2xl text-[var(--color-ivory)] mb-4">
          No Products Found
        </h3>
        <p className="text-zinc-500 font-light text-sm max-w-xs mx-auto">
          We couldn't find any premium products matching your current filter choices. Try widening your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
