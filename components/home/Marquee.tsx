"use client";

import { motion } from "framer-motion";

export function Marquee() {
  const words = [
    "NEW ARRIVALS",
    "PREMIUM QUALITY",
    "EXCLUSIVE",
    "HANDPICKED",
    "LUXURY",
    "ELEGANCE",
  ];

  return (
    <div className="bg-[var(--color-gold)] py-3 overflow-hidden whitespace-nowrap flex items-center border-y border-[var(--color-ivory)]/20">
      <motion.div
        className="flex gap-8 items-center"
        animate={{ x: [0, -1035] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15,
        }}
      >
        {/* Duplicate the array multiple times to ensure seamless infinite scroll */}
        {[...words, ...words, ...words, ...words].map((word, index) => (
          <div key={index} className="flex items-center gap-8">
            <span className="text-black font-semibold tracking-[0.2em] text-sm md:text-base">
              {word}
            </span>
            <span className="text-black/50 text-xs">◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
