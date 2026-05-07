"use client";
import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { SAMPLE_PRODUCTS } from "@/lib/store";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const featuredProducts = SAMPLE_PRODUCTS.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#3D1014] overflow-x-hidden">
      <SplashScreen />
      <Header />

      {/* 1. Immersive Full-Screen Hero */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like scale */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000"
            alt="Luxury Jewelry Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#FDFBF7]" />
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 text-center pt-24 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.span 
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "0.6em", opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="text-[12px] uppercase text-[#C5A059] font-bold mb-8 block"
            >
              The Pinnacle of Elegance
            </motion.span>

            <h1 className="text-[56px] md:text-[90px] font-serif leading-[1] text-[#3D1014] mb-10 max-w-4xl mx-auto">
              Where <span className="italic font-light text-[#58181F]">Artistry</span> meets <br className="hidden md:block" /> 
              your <span className="relative">
                Essence
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "110%" }}
                  transition={{ delay: 1.8, duration: 1.2 }}
                  className="absolute -bottom-2 -left-[5%] h-[1px] bg-[#C5A059]/40"
                />
              </span>
            </h1>

            <p className="text-[#3D1014] font-sans mb-12 leading-relaxed max-w-xl mx-auto text-[16px] opacity-70">
              Step into the world of Singar Fancy. A curated sanctuary where heirloom jewelry and couture cosmetics converge for the modern muse.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4">
              <Link href="/category/fancy" className="group relative px-12 py-5 bg-[#58181F] text-white overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(88,24,31,0.3)]">
                <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] font-bold">Explore Fancy</span>
                <motion.div 
                  className="absolute inset-0 bg-[#3D1014] translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                />
              </Link>
              <Link href="/category/cosmetics" className="group relative px-12 py-5 border border-[#58181F] text-[#58181F] overflow-hidden transition-all duration-500 hover:bg-[#58181F] hover:text-white bg-white/50 backdrop-blur-sm">
                <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] font-bold">Discover Cosmetics</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Moved lower and refined */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ 
            opacity: { delay: 2, duration: 1 },
            y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[8px] uppercase tracking-[0.5em] text-[#C5A059] font-bold opacity-60">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#C5A059] to-transparent" />
        </motion.div>
      </section>

      {/* 2. The Two Houses - Glassmorphism Reveal */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { 
                id: 'fancy', 
                title: 'Fancy', 
                subtitle: 'House of Adornments', 
                img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
                desc: 'Exquisite earrings, heritage bangles, and timeless hair accessories.' 
              },
              { 
                id: 'cosmetics', 
                title: 'Cosmetics', 
                subtitle: 'The Beauty Atelier', 
                img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
                desc: 'Couture-edited lip colors, fragrances, and professional skincare.' 
              }
            ].map((house, idx) => (
              <motion.div
                key={house.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link href={`/category/${house.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-sm">
                  <img
                    src={house.img}
                    alt={house.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#3D1014]/20 group-hover:bg-[#3D1014]/40 transition-colors duration-500" />
                  
                  {/* Glass Card */}
                  <div className="absolute inset-x-8 bottom-8 p-8 backdrop-blur-md bg-white/10 border border-white/20 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold mb-2">{house.subtitle}</p>
                    <h3 className="text-[42px] font-serif italic text-white mb-4">{house.title}</h3>
                    <p className="text-[12px] text-white/80 leading-relaxed max-w-xs mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {house.desc}
                    </p>
                    <div className="mt-6 inline-block text-[10px] uppercase tracking-[0.3em] text-white border-b border-white/40 pb-1 font-bold">
                      Enter the House
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Atelier Edit - Modern Grid */}
      <section className="py-24 bg-white/50 border-y border-[#F4E8D1]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 text-center md:text-left">
            <div>
              <p className="text-[11px] uppercase tracking-[0.5em] text-[#C5A059] font-bold mb-3">Curated Selection</p>
              <h2 className="font-serif text-[48px] text-[#3D1014]">The Atelier Edit</h2>
            </div>
            <Link href="/category/fancy" className="mt-6 md:mt-0 group flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#3D1014] font-bold">
              <span>View All Collections</span>
              <div className="w-12 h-[1px] bg-[#3D1014] transition-all group-hover:w-20" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: (idx % 4) * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Luxury Promise Bar */}
      <section className="py-20 relative overflow-hidden bg-[#3D1014]">
        {/* Abstract background light */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: "Heirloom Quality", desc: "Crafted with precision and heritage techniques for generations to come." },
              { title: "Bespoke Delivery", desc: "Complimentary velvet-wrapped shipping on all orders above ₹999." },
              { title: "Atelier Care", desc: "Expert guidance and lifetime maintenance for your precious adornments." }
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-12 h-[1px] bg-[#C5A059]/40 mx-auto mb-8 transition-all group-hover:w-24 group-hover:bg-[#C5A059]" />
                <h3 className="text-[22px] font-serif text-[#C5A059] mb-4 italic font-light">{item.title}</h3>
                <p className="text-[12px] uppercase tracking-[0.15em] text-white/50 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
