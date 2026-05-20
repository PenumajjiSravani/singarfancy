"use client";

import { ProductDetail } from "@/components/product/ProductDetail";
import { notFound } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import { useState, useEffect, use } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { products } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
          Opening Curation Record...
        </div>
      </div>
    );
  }

  // Look up product dynamically in our client-side persisted store
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Related products (exclude current, matching similar category or general list)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.category))
    .slice(0, 4);

  // Dynamically set document title client-side for immediate feedback
  if (typeof window !== "undefined") {
    document.title = `${product.name} - Singar Fancy Curations`;
  }

  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Detail Component */}
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}
