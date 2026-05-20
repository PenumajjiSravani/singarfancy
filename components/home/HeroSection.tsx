"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section 
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Placeholder image, should use a real luxury image later */}
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop')" }}
        />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-[var(--color-gold)] tracking-[0.3em] text-sm md:text-base font-semibold uppercase mb-6 block">
            The Ultimate Luxury Experience
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-[var(--color-ivory)] mb-8 leading-tight">
            Where Elegance <br className="hidden md:block" />
            <span className="italic text-[var(--color-gold)]">Meets You</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 mb-12 text-lg font-light">
            Discover our curated collection of premium jewelry, accessories, cosmetics, and fine clothing crafted for the extraordinary.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="w-full sm:w-auto">
              EXPLORE COLLECTION
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              DISCOVER MORE
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[var(--color-ivory)] text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent" />
      </motion.div>
    </section>
  );
}
