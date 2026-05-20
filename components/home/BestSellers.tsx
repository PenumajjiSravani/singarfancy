"use client";

import { ProductCard, Product } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const mockBestSellers: Product[] = [
  {
    id: "6",
    name: "Golden Hour Hoop Earrings",
    slug: "golden-hour-hoop-earrings",
    description: "Elegant textured hoop earrings handcrafted in recycled 18k gold.",
    price: 6500,
    comparePrice: 9000,
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"],
    stock: 15,
    isFeatured: true,
  },
  {
    id: "7",
    name: "Crimson Velvet Lip Glaze",
    slug: "crimson-velvet-lip-glaze",
    description: "Premium velvet liquid lipstick in deep imperial crimson.",
    price: 2200,
    comparePrice: 3000,
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop"],
    stock: 30,
    isFeatured: true,
  },
  {
    id: "8",
    name: "Chrono Gold Timepiece",
    slug: "chrono-gold-timepiece",
    description: "Chronograph luxury watch with gold-toned face and premium leather strap.",
    price: 45000,
    comparePrice: 60000,
    images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop"],
    stock: 2,
    isFeatured: true,
  },
  {
    id: "9",
    name: "Majestic Gifting Hamper",
    slug: "majestic-gifting-hamper",
    description: "A luxury curation of our best sellers, packaged in a plush velvet box.",
    price: 15000,
    comparePrice: 22000,
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop"],
    stock: 4,
    isFeatured: true,
  },
];

export function BestSellers() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase mb-3 block">
            Most Coveted
          </span>
          <h2 className="text-3xl md:text-5xl font-display text-[var(--color-ivory)] mb-4">
            Our Best Sellers
          </h2>
          <p className="text-gray-400 font-light max-w-md mx-auto">
            These exceptional pieces are highly desired and carefully handpicked by our curators.
          </p>
        </div>

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mockBestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline">
              VIEW ALL PRODUCTS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
