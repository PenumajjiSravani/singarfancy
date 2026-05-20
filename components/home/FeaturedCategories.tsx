"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Fine Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    href: "/category/jewelry",
  },
  {
    id: 2,
    name: "Luxury Watches",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
    href: "/category/watches",
  },
  {
    id: 3,
    name: "Premium Cosmetics",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
    href: "/category/cosmetics",
  },
  {
    id: 4,
    name: "Designer Handbags",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop",
    href: "/category/handbags",
  },
  {
    id: 5,
    name: "Elegant Apparel",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
    href: "/category/apparel",
  },
  {
    id: 6,
    name: "Exclusive Gifting",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    href: "/category/gifting",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display text-[var(--color-ivory)] mb-4">Curated Categories</h2>
          <p className="text-gray-400 font-light">Explore our carefully selected collections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link href={category.href} className="group relative block h-[400px] overflow-hidden rounded-sm">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full flex items-end justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-display text-[var(--color-ivory)]">{category.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-[var(--color-gold)] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
