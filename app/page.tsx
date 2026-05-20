import { HeroSection } from "@/components/home/HeroSection";
import { Marquee } from "@/components/home/Marquee";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BestSellers } from "@/components/home/BestSellers";
import { OurPromise } from "@/components/home/OurPromise";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Marquee />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
      <OurPromise />
      <Testimonials />
    </div>
  );
}
