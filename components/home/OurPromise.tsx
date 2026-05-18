"use client";

import { ShieldCheck, Truck, RotateCcw, Gem } from "lucide-react";
import { motion } from "framer-motion";

const promises = [
  {
    icon: Truck,
    title: "Complimentary Shipping",
    description: "Enjoy secure, fully insured complimentary express shipping on all orders.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Rest assured with our fully encrypted, secure payment processing systems.",
  },
  {
    icon: RotateCcw,
    title: "Graceful Returns",
    description: "We offer hassle-free, fully guided returns within 14 days of purchase.",
  },
  {
    icon: Gem,
    title: "Authentic Luxury",
    description: "Every piece comes with a certificate of authenticity and quality guarantee.",
  },
];

export function OurPromise() {
  return (
    <section className="py-24 bg-[#080808] border-t border-[var(--border)]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {promises.map((promise, index) => {
            const Icon = promise.icon;
            return (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card p-8 text-center flex flex-col items-center rounded-sm hover:border-[var(--color-gold)] transition-colors duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center border border-[var(--border)] mb-6 text-[var(--color-gold)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display text-[var(--color-ivory)] mb-4">{promise.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">{promise.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
