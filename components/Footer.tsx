"use client";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-muted pt-12 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                    <div className="md:col-span-1">
                        <Link href="/" className="group inline-block mb-6">
                            <span className="block text-[10px] tracking-[0.4em] uppercase text-accent font-bold mb-1 group-hover:text-primary transition-colors">Singar</span>
                            <span className="block text-3xl font-serif text-primary italic leading-none">Fancy</span>
                        </Link>
                        <p className="text-foreground/50 text-[11px] uppercase tracking-widest leading-relaxed max-w-[200px]">
                            A house of fine adornments and beauty, curated for the modern connoisseur.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-4">Shop</h4>
                        <ul className="space-y-3 text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                            <li><Link href="/category/fancy" className="hover:text-primary transition-colors">Fancy</Link></li>
                            <li><Link href="/category/cosmetics" className="hover:text-primary transition-colors">Cosmetics</Link></li>
                            <li><Link href="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-4">Maison</h4>
                        <ul className="space-y-3 text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                            <li><Link href="#" className="hover:text-primary transition-colors">Our Story</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Boutiques</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Gifting</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-4">Atelier Letters</h4>
                        <p className="text-[11px] italic font-serif text-foreground/60 mb-4">Whispers from the studio, in your inbox.</p>
                        <div className="flex gap-0 border-b border-primary/20 pb-2">
                            <input
                                suppressHydrationWarning
                                type="email"
                                placeholder="Your email"
                                className="bg-transparent flex-1 text-xs px-0 focus:outline-none placeholder:text-foreground/30 font-serif italic"
                            />
                            <button
                                suppressHydrationWarning
                                className="text-[10px] uppercase font-bold tracking-widest text-primary hover:text-accent transition-colors"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between text-[9px] uppercase tracking-[0.3em] text-foreground/30 mt-8">
                    <p>© 2026 Singar Fancy · Crafted with Devotion</p>
                </div>
            </div>
        </footer>
    );
}
