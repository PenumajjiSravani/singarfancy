"use client";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const cart = useStore((state) => state.cart);
    const { data: session } = useSession();
    const user = session?.user;
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* 1. Announcement Bar */}
            <div className={`fixed top-0 z-[60] w-full bg-[#58181F] text-white text-[9px] uppercase tracking-[0.4em] h-9 flex items-center justify-center font-bold transition-transform duration-500 ${isScrolled ? "-translate-y-full" : "translate-y-0"}`}>
                Complimentary Shipping on orders above ₹999
            </div>

            {/* 2. Header */}
            <header 
                className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled 
                    ? "top-0 py-3 bg-white/80 backdrop-blur-md border-b border-muted shadow-md" 
                    : "top-9 py-5 bg-white border-b border-muted"
                }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Desktop Nav Left */}
                    <nav className="hidden lg:flex items-center space-x-12 text-[10px] uppercase tracking-[0.3em] font-bold">
                        {["Home", "Fancy", "Cosmetics"].map((item) => (
                            <Link 
                                key={item}
                                href={item === "Home" ? "/" : `/category/${item.toLowerCase()}`} 
                                className="relative group transition-colors duration-300 text-[#3D1014]"
                            >
                                <span>{item}</span>
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Logo Center */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 hover:scale-105">
                        <Image 
                            src="/logo.png" 
                            alt="Singar Fancy Logo" 
                            width={isScrolled ? 120 : 160} 
                            height={60} 
                            style={{ height: 'auto' }}
                            className="object-contain transition-all duration-500"
                            priority
                        />
                    </Link>

                    {/* Icons Right */}
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-[#3D1014] hover:text-[#C5A059] transition-colors">
                            <Search size={18} strokeWidth={1.5} />
                        </button>
                        
                        {user ? (
                            <Link
                                href={user.role === "admin" ? "/admin" : "/dashboard"}
                                className="p-2 text-[#3D1014] hover:text-[#C5A059] transition-colors"
                            >
                                <LayoutDashboard size={18} strokeWidth={1.5} />
                            </Link>
                        ) : (
                            <Link href="/login" className="p-2 text-[#3D1014] hover:text-[#C5A059] transition-colors">
                                <User size={18} strokeWidth={1.5} />
                            </Link>
                        )}

                        <Link href="/cart" className="p-2 text-[#3D1014] hover:text-[#C5A059] transition-colors relative group">
                            <ShoppingBag size={18} strokeWidth={1.5} />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-1 right-1 bg-[#58181F] text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Mobile Toggle */}
                        <button className="lg:hidden p-2 text-[#58181F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white border-t border-muted overflow-hidden"
                        >
                            <div className="flex flex-col p-8 space-y-6 text-center">
                                {["Home", "Fancy", "Cosmetics"].map((item) => (
                                    <Link 
                                        key={item}
                                        href={item === "Home" ? "/" : `/category/${item.toLowerCase()}`} 
                                        className="text-[12px] uppercase tracking-[0.3em] font-bold text-[#3D1014]"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
}
