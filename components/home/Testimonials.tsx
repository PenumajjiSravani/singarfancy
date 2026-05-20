"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aishwarya Rai",
    role: "Collector & Artist",
    review: "The Golden Royale necklace exceeds all my expectations. The craftsmanship is divine, reminiscent of royal heritage, and the customer service was absolutely flawless.",
    rating: 5,
  },
  {
    name: "Vikram Sen",
    role: "Connoisseur",
    review: "Purchased the Chrono Gold timepiece as a milestone gift. The sophistication and weight of the watch are remarkable. A true masterpiece of design.",
    rating: 5,
  },
  {
    name: "Meera Patel",
    role: "Designer",
    review: "Their premium cosmetics are an absolute joy to use. Beautifully pigmented and luxurious packaging. Singar Fancy has become my absolute favorite boutique.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background border-t border-[var(--border)]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase mb-3 block">
            Reviews
          </span>
          <h2 className="text-3xl md:text-5xl font-display text-[var(--color-ivory)] mb-4">
            Voices of Elegance
          </h2>
          <p className="text-gray-400 font-light">
            Hear from our esteemed clientele about their custom luxury experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-8 flex flex-col justify-between rounded-sm"
            >
              <div>
                <div className="flex gap-1 mb-6 text-[var(--color-gold)]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--color-gold)]" />
                  ))}
                </div>
                <p className="text-gray-300 italic font-light text-base leading-relaxed mb-8">
                  "{t.review}"
                </p>
              </div>

              <div>
                <h4 className="font-accent text-[var(--color-ivory)] text-lg mb-1">{t.name}</h4>
                <p className="text-xs text-[var(--color-gold)] tracking-widest uppercase">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
