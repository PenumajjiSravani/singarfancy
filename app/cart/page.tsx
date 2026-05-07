"use client";
import { useStore } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart, user } = useStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 2000 ? 0 : 150;
    const total = subtotal + shipping;

    // Auth guard — show sign-in prompt if not logged in
    if (!user) {
        return (
            <main className="min-h-screen bg-[#FDFBF7]">
                <Header />
                <div className="container mx-auto px-4 py-32 text-center max-w-md">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="w-20 h-20 bg-[#58181F]/8 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={32} className="text-[#58181F]/40" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold mb-3">Sign In Required</p>
                        <h1 className="text-[32px] font-serif text-[#3D1014] mb-4 leading-tight">
                            Your cart awaits you
                        </h1>
                        <p className="text-[#3D1014]/50 text-sm leading-relaxed mb-8">
                            Please sign in to view your cart, add items, and complete your purchase at Singar Fancy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/login"
                                className="bg-[#58181F] text-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-[#3D1014] transition-colors rounded-lg"
                            >
                                <LogIn size={14} /> Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="border border-[#58181F] text-[#58181F] px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center hover:bg-[#58181F] hover:text-white transition-colors rounded-lg"
                            >
                                Create Account
                            </Link>
                        </div>
                        <p className="mt-6 text-[11px] text-[#3D1014]/30">
                            or{" "}
                            <Link href="/" className="text-[#C5A059] hover:underline font-medium">Continue browsing</Link>
                        </p>
                    </motion.div>
                </div>
                <Footer />
            </main>
        );
    }

    if (cart.length === 0 && !isCheckingOut) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-32 text-center">
                    <ShoppingBag size={64} className="mx-auto text-accent/20 mb-8" />
                    <h1 className="text-4xl font-serif text-primary mb-4">Your Atelier Bag is Empty</h1>
                    <p className="text-muted-foreground mb-8">Begin your journey through our curated collections.</p>
                    <Link href="/" className="luxury-button inline-block">Start Shopping</Link>
                </div>
                <Footer />
            </main>
        );
    }

    if (isCheckingOut) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-32 text-center max-w-lg">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="text-accent text-3xl font-serif">SF</span>
                        </div>
                        <h1 className="text-4xl font-serif text-primary mb-4">Thank You</h1>
                        <p className="text-muted-foreground mb-8 text-lg">Your luxury selection has been reserved. Our styling concierge will contact you shortly to complete the private transaction.</p>
                        <button 
                            onClick={() => { clearCart(); setIsCheckingOut(false); }}
                            className="luxury-button w-full"
                        >
                            Return to Boutique
                        </button>
                    </motion.div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-5xl font-serif text-primary mb-12 border-b border-accent/20 pb-8 tracking-tight">Shopping Bag</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex gap-6 pb-8 border-b border-accent/10"
                                >
                                    <div className="w-32 aspect-[3/4] overflow-hidden bg-muted">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-2">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-serif text-primary">{item.name}</h3>
                                                <button onClick={() => removeFromCart(item.id)} className="text-primary hover:text-accent transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <p className="text-xs uppercase tracking-widest text-accent mt-1">{item.subcategory}</p>
                                        </div>
                                        
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center border border-accent/20 rounded-none bg-background">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-muted text-primary transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center text-sm font-sans">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-muted text-primary transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm line-through opacity-30">₹{item.mrp * item.quantity}</p>
                                                <p className="text-xl font-bold text-primary">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-muted/30 p-8 border border-accent/10 sticky top-32">
                            <h2 className="text-2xl font-serif text-primary mb-8 border-b border-accent/20 pb-4">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-primary/60">Subtotal</span>
                                    <span className="text-primary">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-primary/60">Shipping</span>
                                    <span className="text-primary">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-[10px] text-accent uppercase tracking-widest leading-relaxed">Spend ₹{2000 - subtotal} more for complimentary delivery.</p>
                                )}
                                <div className="border-t border-accent/20 pt-4 mt-4 flex justify-between">
                                    <span className="text-lg font-serif text-primary">Total</span>
                                    <span className="text-2xl font-bold text-primary">₹{total}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCheckingOut(true)}
                                className="luxury-button w-full flex items-center justify-center gap-2 group"
                            >
                                Secure Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-[10px] text-center mt-6 text-primary/40 leading-relaxed uppercase tracking-tighter">
                                All orders are processed in a secure environment and wrapped in our signature ivory & gold packaging.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
