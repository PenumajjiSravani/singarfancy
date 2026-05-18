"use client";

import { ShoppingBag, Search, Menu, User, Heart, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { openCart } = useUIStore();
  const { items } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, logout } = useAuthStore();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300",
        isScrolled ? "glass-nav py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="md:hidden text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors">
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-2xl md:text-3xl font-display font-semibold tracking-wider text-[var(--color-ivory)] group">
          <div className="relative w-8 h-8 md:w-9 h-9 overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:rotate-[5deg]">
            <Image
              src="/Favicon.png"
              alt="Singar Fancy Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span>
            SINGAR <span className="text-[var(--color-gold)]">FANCY</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link href="/products" className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors">
            COLLECTIONS
          </Link>
          <Link href="/category/jewelry" className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors">
            JEWELRY
          </Link>
          <Link href="/category/accessories" className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors">
            ACCESSORIES
          </Link>
          <Link href="/category/cosmetics" className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors">
            COSMETICS
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <Link href="/wishlist" className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors relative">
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-3 h-3 flex items-center justify-center rounded-full" />
            )}
          </Link>

          {/* Profile Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-1 cursor-pointer relative py-2"
            >
              <User className="w-5 h-5" />
              {mounted && user && (
                <span className="absolute top-1 right-0 w-2 h-2 rounded-full bg-[var(--color-gold)]" />
              )}
            </button>

            {/* Premium Dropdown Box */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-3 w-56 glass-card border border-zinc-850 rounded-sm p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-300"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {mounted && user ? (
                  // Logged In View
                  <div className="space-y-1">
                    <div className="px-3 py-2 border-b border-zinc-900 mb-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest">Signed In As</p>
                      <p className="text-sm font-semibold text-[var(--color-ivory)] truncate mt-0.5">{user.name}</p>
                      <span className="inline-block text-[9px] text-[var(--color-gold)] border border-[var(--color-gold)]/30 px-1.5 py-0.2 uppercase tracking-widest font-semibold mt-1">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile?tab=details"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-300 hover:text-[var(--color-gold)] hover:bg-zinc-900/30 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-500" />
                      My Profile
                    </Link>

                    <Link
                      href="/profile?tab=orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-300 hover:text-[var(--color-gold)] hover:bg-zinc-900/30 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-zinc-500" />
                      My Orders
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-300 hover:text-[var(--color-gold)] hover:bg-zinc-900/30 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-zinc-500" />
                      Your Wishlist
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs text-[var(--color-gold)] hover:underline hover:bg-zinc-900/30 transition-colors font-semibold"
                      >
                        <User className="w-4 h-4 text-[var(--color-gold)]" />
                        Curator Portal
                      </Link>
                    )}

                    <div className="border-t border-zinc-900 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          toast.success("Successfully logged out.");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/10 transition-colors text-left cursor-pointer font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-red-450" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  // Logged Out View
                  <div className="space-y-1 py-1">
                    <p className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                      Boutique Entrance
                    </p>
                    <Link
                      href="/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs text-zinc-300 hover:text-[var(--color-gold)] hover:bg-zinc-900/30 transition-colors font-semibold"
                    >
                      <User className="w-4 h-4 text-zinc-500" />
                      Sign In / Register
                    </Link>
                    
                    <Link
                      href="/wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs text-zinc-300 hover:text-[var(--color-gold)] hover:bg-zinc-900/30 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-zinc-500" />
                      Your Wishlist
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={openCart}
            className="text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-black text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
