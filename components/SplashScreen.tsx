"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(true);

    useEffect(() => {
        // Check if already shown in this session
        const shown = sessionStorage.getItem("splashShown");
        if (shown) {
            setHasShown(true);
            setIsVisible(false);
        } else {
            setHasShown(false);
            setIsVisible(true);
            sessionStorage.setItem("splashShown", "true");
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4500);
        return () => clearTimeout(timer);
    }, []);

    if (hasShown && !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#3D1014]"
                >
                    {/* Cinematic Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Moving Light Beam */}
                        <motion.div 
                            animate={{ 
                                x: ["-100%", "200%"],
                                opacity: [0, 0.3, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-accent/20 to-transparent skew-x-12"
                        />
                        
                        {/* Radial Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.15)_0%,transparent_70%)]" />
                        
                        {/* Subtle Texture */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
                    </div>

                    {/* Animated Frame Border */}
                    <motion.div 
                        initial={{ width: "200px", height: "100px", opacity: 0 }}
                        animate={{ width: "90%", height: "90%", opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute border border-accent/10 rounded-sm pointer-events-none"
                    />

                    <motion.div
                        className="text-center relative z-10 flex flex-col items-center gap-20"
                    >
                        {/* Top Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            <p className="text-accent text-[12px] tracking-[0.8em] uppercase font-bold opacity-80 shimmer-text">
                                Established with Love
                            </p>
                        </motion.div>
                        
                        {/* Main Logo Section with Animated Sparkles */}
                        <div className="relative group">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                    delay: 0.8, 
                                    duration: 1.5, 
                                    ease: [0.16, 1, 0.3, 1] 
                                }}
                                className="relative z-10"
                            >
                                <Image 
                                    src="/logo.png" 
                                    alt="Singar Fancy Logo" 
                                    width={450} 
                                    height={280} 
                                    style={{ height: 'auto' }}
                                    className="object-contain drop-shadow-[0_0_50px_rgba(197,160,89,0.25)]"
                                    priority
                                />
                                
                                {/* Overlay Sparkles */}
                                <motion.div 
                                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                                    className="absolute top-[10%] left-[45%] text-accent z-20"
                                >
                                    <Sparkles size={20} fill="currentColor" />
                                </motion.div>
                                
                                <motion.div 
                                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2.5, delay: 1.5 }}
                                    className="absolute top-[20%] right-[35%] text-accent z-20"
                                >
                                    <Sparkles size={16} fill="currentColor" />
                                </motion.div>
                                
                                <motion.div 
                                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1.8, delay: 2 }}
                                    className="absolute top-[5%] left-[35%] text-accent z-20"
                                >
                                    <Sparkles size={14} fill="currentColor" />
                                </motion.div>
                            </motion.div>
                            
                            {/* Decorative Flourish */}
                            <motion.div 
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: 1.2, duration: 1 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                            />
                        </div>

                        {/* Bottom Text */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="flex items-center gap-10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: 100 }}
                                    transition={{ delay: 2, duration: 1 }}
                                    className="h-[1px] bg-accent/20" 
                                />
                                <p className="text-accent/70 text-[11px] tracking-[1em] uppercase font-light italic">
                                    Adornments <span className="mx-2 opacity-30">·</span> Beauty
                                </p>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: 100 }}
                                    transition={{ delay: 2, duration: 1 }}
                                    className="h-[1px] bg-accent/20" 
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    {/* Bottom Progress Bar (Subtle) */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-accent/10 overflow-hidden">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 4, ease: "linear" }}
                            className="w-full h-full bg-accent/40"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
