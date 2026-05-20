"use client";

import { Product, ProductCard } from "./ProductCard";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, Plus, Minus, ArrowRight, ChevronDown, Edit2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "returns">("details");
  const [mounted, setMounted] = useState(false);
  
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to your bag!`);
  };

  const handlePlaceOrder = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to bag. Directing to checkout...`);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (isFavorite) {
      toast.info(`Removed ${product.name} from your selections.`);
    } else {
      toast.success(`Saved ${product.name} to your selections!`);
    }
  };

  const isFavorite = isInWishlist(product.id);
  const isAdmin = mounted && user?.role === "ADMIN";

  return (
    <div className="space-y-24">
      {/* Breadcrumbs */}
      <nav className="text-sm font-light tracking-wider text-zinc-500 uppercase flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[var(--color-gold)] transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-[var(--color-ivory)]">{product.name}</span>
      </nav>

      {/* Main product view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-[4/5] bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden group">
            <Image
              src={activeImage || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 border aspect-[4/5] bg-zinc-950 overflow-hidden ${
                    activeImage === img ? "border-[var(--color-gold)]" : "border-zinc-800"
                  }`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display text-[var(--color-ivory)] mb-4">
              {product.name}
            </h1>
            
            {/* Reviews / Rating */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex text-[var(--color-gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                ))}
              </div>
              <span className="text-zinc-500 font-light">| &nbsp; 12 Reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 border-y border-zinc-900 py-6">
            <span className="text-3xl font-medium text-[var(--color-gold)]">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-zinc-600 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {product.comparePrice && (
              <span className="bg-[var(--color-gold)] text-black font-bold text-xs uppercase px-2.5 py-0.5 rounded-sm tracking-wider">
                SAVE {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-zinc-300 font-light text-base leading-relaxed">
            {product.description}
          </p>

          {/* Stock state */}
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-zinc-400">
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : "Out of Stock"}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Quantity Picker */}
            <div className="flex items-center border border-zinc-800 rounded-sm self-start sm:self-auto h-14 bg-zinc-950 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-zinc-400 hover:text-[var(--color-gold)] transition-colors h-full flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 font-semibold text-base min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-zinc-400 hover:text-[var(--color-gold)] transition-colors h-full flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-14 border border-[var(--color-gold)] text-[var(--color-gold)] font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 rounded-none cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              ADD TO BAG
            </button>
            
            {/* Conditional Button: Place Order for Clients, Edit Product for Curators */}
            {isAdmin ? (
              <Link 
                href="/admin/products"
                className="flex-1 h-14 bg-zinc-900 border border-zinc-800 text-[var(--color-gold)] hover:border-[var(--color-gold)] hover:bg-zinc-950 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all duration-300 rounded-none cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                EDIT IN PORTAL
              </Link>
            ) : (
              <button
                onClick={handlePlaceOrder}
                className="flex-1 h-14 bg-[var(--color-gold)] text-black font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all duration-300 rounded-none cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                PLACE ORDER
              </button>
            )}
            
            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`w-14 h-14 border rounded-none flex items-center justify-center transition-all cursor-pointer ${
                isFavorite
                  ? "border-red-500/50 bg-red-950/20 text-red-500"
                  : "border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/50"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
            </button>
          </div>

          {/* Luxury details accordions */}
          <div className="border-t border-zinc-900 pt-6 space-y-4">
            {/* Detail Tab */}
            <div className="border-b border-zinc-900 pb-4">
              <button
                onClick={() => setActiveTab(activeTab === "details" ? "details" : "details")}
                className="w-full flex items-center justify-between text-left text-sm font-semibold tracking-wider text-[var(--color-ivory)] uppercase"
              >
                <span>Product Details</span>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>
              <div className="mt-3 text-sm text-zinc-400 font-light leading-relaxed">
                Handcrafted using ethically-sourced fine materials. Premium gold finishing that never fades. Certified conflict-free diamonds.
              </div>
            </div>

            {/* Shipping Tab */}
            <div className="border-b border-zinc-900 pb-4">
              <button
                className="w-full flex items-center justify-between text-left text-sm font-semibold tracking-wider text-[var(--color-ivory)] uppercase"
              >
                <span>Complimentary Shipping</span>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>
              <div className="mt-3 text-sm text-zinc-400 font-light leading-relaxed flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <Truck className="w-5 h-5 text-[var(--color-gold)]" />
                  <span>Complimentary insured shipping on all luxury purchases.</span>
                </div>
                <div className="flex gap-3 items-center">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-gold)]" />
                  <span>Secure double-boxed protective signature packaging.</span>
                </div>
              </div>
            </div>

            {/* Returns Tab */}
            <div className="border-b border-zinc-900 pb-4">
              <button
                className="w-full flex items-center justify-between text-left text-sm font-semibold tracking-wider text-[var(--color-ivory)] uppercase"
              >
                <span>Hassle-Free Returns</span>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>
              <div className="mt-3 text-sm text-zinc-400 font-light leading-relaxed">
                We accept graceful 14-day fully-guided return pick-up. Items must be returned unworn and in their original double-boxed luxury packaging.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-900 pt-20">
          <h2 className="text-2xl md:text-3xl font-display text-[var(--color-ivory)] mb-12 text-center md:text-left">
            Complete the Look
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
