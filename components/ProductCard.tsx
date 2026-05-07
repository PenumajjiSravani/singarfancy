"use client";
import { Product, useStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AuthToast from "@/components/AuthToast";

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart, user } = useStore();
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    const [showToast, setShowToast] = useState(false);
    // Defer user-state-dependent rendering to client only — prevents SSR hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            setShowToast(true);
            return;
        }
        addToCart(product);
    };

    return (
        <>
            <AuthToast
                show={showToast}
                message="Please sign in to add items to your cart."
                onClose={() => setShowToast(false)}
            />

            <motion.div
                whileHover={{ y: -3 }}
                className="group relative bg-background overflow-hidden"
            >
                {/* Image Container */}
                <Link href={`/product/${product.id}`} className="block aspect-square overflow-hidden relative bg-[#F9F6F0]">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-[#58181F] text-white px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                            -{discount}%
                        </div>
                    )}

                    {/* Quick Add Overlay — always shows "Add to Cart" text on server to avoid mismatch */}
                    <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                            suppressHydrationWarning
                            onClick={handleAddToCart}
                            className="w-full bg-[#58181F] text-[#FDFBF7] py-2 text-[8px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-1.5 hover:bg-[#3D1014] transition-colors"
                        >
                            <ShoppingCart size={10} />
                            {/* Render stable text on server; swap only after mount */}
                            {mounted && !user ? "Sign In to Add" : "Add to Cart"}
                        </button>
                    </div>
                </Link>

                {/* Content */}
                <div className="pt-2 pb-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] mb-0.5 font-bold">{product.subcategory}</p>
                    <Link href={`/product/${product.id}`}>
                        <h3 className="font-serif text-[13px] text-[#3D1014] mb-1 line-clamp-1 group-hover:text-[#C5A059] transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-1.5">
                        <span className="text-[#3D1014] font-bold text-[12px] font-sans">₹{product.price}</span>
                        <span className="text-[#3D1014]/30 text-[10px] line-through font-sans">₹{product.mrp}</span>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
