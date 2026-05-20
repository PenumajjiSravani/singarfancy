"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  isFeatured: boolean;
  category?: string;
  sku?: string;
  tags?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to your luxury bag!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (isWishlisted) {
      toast.info(`Removed ${product.name} from your selections.`);
    } else {
      toast.success(`Saved ${product.name} to your selections!`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative glass-card rounded-sm overflow-hidden flex flex-col h-full"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
        <Image
          src={product.images[0] || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-[var(--color-gold)] text-black text-xs font-bold px-2.5 py-1 uppercase tracking-wider rounded-sm z-10">
            {discount}% OFF
          </span>
        )}

        {/* Action Buttons (Wishlist, Quick View, Add to Cart overlay) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
          <div className="flex justify-end">
            <button
              onClick={handleToggleWishlist}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[var(--color-ivory)] hover:text-red-500 hover:scale-110 transition-all cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-[var(--color-ivory)] text-black font-semibold text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-[var(--color-gold)] transition-colors duration-300 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              ADD TO CART
            </button>
            <button 
              onClick={handleQuickView}
              className="w-12 h-12 bg-black/60 hover:bg-black/90 border border-zinc-800 flex items-center justify-center text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-accent text-lg text-[var(--color-ivory)] group-hover:text-[var(--color-gold)] transition-colors mb-2 line-clamp-1">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 mb-4 font-light">
            {product.description}
          </p>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-[var(--color-gold)] font-medium text-lg">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-zinc-600 line-through text-sm">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
