"use client";
import { SAMPLE_PRODUCTS, useStore } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AuthToast from "@/components/AuthToast";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ShoppingBag, Heart, Check, Plus, Minus, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { addToCart, toggleWishlist, wishlist, user } = useStore();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const product = useMemo(() => SAMPLE_PRODUCTS.find(p => p.id === id), [id]);
    const isInWishlist = wishlist.includes(id);

    if (!product) return <div className="p-20 text-center font-serif text-3xl">Whisper of selection lost in time...</div>;

    const handleAddToCart = () => {
        if (!user) {
            setToastMsg("Please sign in to add items to your cart.");
            setShowToast(true);
            return;
        }
        for (let i = 0; i < quantity; i++) addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlist = () => {
        if (!user) {
            setToastMsg("Please sign in to save items to your wishlist.");
            setShowToast(true);
            return;
        }
        toggleWishlist(product.id);
    };

    const relatedProducts = SAMPLE_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <main className="min-h-screen bg-background">
            <AuthToast
                show={showToast}
                message={toastMsg}
                onClose={() => setShowToast(false)}
            />
            <Header />
            
            <div className="container mx-auto px-4 py-12">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] mb-12 hover:text-accent transition-colors">
                    <ArrowLeft size={16} /> Back to Collection
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 mb-32">
                    {/* Image Area */}
                    <div className="relative group">
                        <div className="aspect-[3/4] overflow-hidden bg-muted">
                            <motion.img 
                                layoutId={`img-${id}`}
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 border border-accent/20 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
                    </div>

                    {/* Info Area */}
                    <div className="flex flex-col">
                        <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-4">{product.subcategory}</span>
                        <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6 leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                            <span className="text-xl line-through text-primary/30">₹{product.mrp}</span>
                            <span className="bg-accent text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                Save {Math.round(((product.mrp - product.price)/product.mrp)*100)}%
                            </span>
                        </div>

                        <p className="text-primary/70 leading-relaxed mb-12 text-lg">
                            {product.description} Each piece is hand-selected and quality checked. This luxury {product.category} item reflects the pinnacle of Indian craftsmanship and modern aesthetics.
                        </p>

                        <div className="flex flex-col gap-6 mb-12">
                            <div className="flex items-center gap-4">
                                <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Quantity</span>
                                <div className="flex items-center border border-accent/20 px-2 py-1">
                                    <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="p-2 text-primary hover:text-accent"><Minus size={14}/></button>
                                    <span className="w-12 text-center font-serif text-lg">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity+1)} className="p-2 text-primary hover:text-accent"><Plus size={14}/></button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleAddToCart}
                                    className="flex-1 luxury-button flex items-center justify-center gap-3 h-14"
                                >
                                    {isAdded ? <><Check size={18}/> Added to Bag</> : <><ShoppingBag size={18}/> Reserve for Bag</>}
                                </button>
                                <button
                                    onClick={handleWishlist}
                                    className={`w-14 h-14 flex items-center justify-center border transition-all duration-300 ${
                                        isInWishlist ? 'bg-accent border-accent text-primary' : 'border-accent/30 text-primary hover:border-accent'
                                    }`}
                                >
                                    <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-8 border-t border-accent/10 pt-12">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-accent" size={24} />
                                <div>
                                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-primary">Authenticity Guaranteed</h4>
                                    <p className="text-[10px] text-primary/50">100% Genuine Luxury Items</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Truck className="text-accent" size={24} />
                                <div>
                                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-primary">Discreet Delivery</h4>
                                    <p className="text-[10px] text-primary/50">Signature Ivory Packaging</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Section */}
                <section className="border-t border-accent/10 pt-24 pb-12">
                    <h2 className="text-4xl font-serif text-primary mb-12">Complementary Pieces</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
