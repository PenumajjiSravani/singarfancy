"use client";
import { SAMPLE_PRODUCTS } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [activeSub, setActiveSub] = useState("All");
    const [sortBy, setSortBy] = useState("featured");

    const categoryProducts = useMemo(() => {
        return SAMPLE_PRODUCTS.filter(p => p.category === slug);
    }, [slug]);

    const subcategories = useMemo(() => {
        const subs = Array.from(new Set(categoryProducts.map(p => p.subcategory)));
        return ["All", ...subs];
    }, [categoryProducts]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = activeSub === "All" 
            ? categoryProducts 
            : categoryProducts.filter(p => p.subcategory === activeSub);

        if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
        
        return result;
    }, [categoryProducts, activeSub, sortBy]);

    return (
        <main className="min-h-screen bg-background">
            <Header />
            
            {/* Category Header */}
            <section className="bg-primary py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-serif text-background capitalize shimmer-text">
                        {slug}
                    </h1>
                    <p className="text-accent uppercase tracking-[0.3em] text-xs mt-4">
                        Curated Luxury Selection
                    </p>
                </div>
            </section>

            {/* Filters & Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-accent/10 pb-8">
                        {/* Sub-category Chips */}
                        <div className="flex flex-wrap gap-2">
                            {subcategories.map(sub => (
                                <button 
                                    key={sub}
                                    onClick={() => setActiveSub(sub)}
                                    className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                                        activeSub === sub 
                                        ? 'bg-primary text-background' 
                                        : 'border border-accent/20 text-primary hover:border-accent'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>

                        {/* Sorting */}
                        <div className="relative group min-w-[200px]">
                            <select 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-transparent border border-accent/20 px-4 py-2 text-xs uppercase tracking-widest appearance-none focus:outline-none focus:border-accent text-primary"
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent" />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                        {filteredAndSortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredAndSortedProducts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="font-serif text-2xl text-primary/40 italic">Coming soon to our boutique...</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
