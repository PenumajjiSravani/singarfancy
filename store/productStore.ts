import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/components/product/ProductCard";

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Golden Royale Necklace",
    slug: "golden-royale-necklace",
    description: "A gorgeous 24k gold plated necklace with embedded champagne diamonds. Meticulously handcrafted by royal heritage designers, this piece stands out with pure luxury and majestic weight. Fits perfectly for premium celebrations.",
    price: 12500,
    comparePrice: 18000,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 5,
    isFeatured: true,
    category: "Fine Jewelry",
    sku: "SF-GLD-RYL-NCK",
  },
  {
    id: "2",
    name: "Emperor Gold Ring",
    slug: "emperor-gold-ring",
    description: "Imperial gold band with detailed hand engraving. Inspired by royal seals, this ring features high-relief scroll patterns and a high-polish finish. Excellent styling for collectors and true connoisseurs.",
    price: 8900,
    comparePrice: 12000,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 10,
    isFeatured: true,
    category: "Fine Jewelry",
    sku: "SF-EMP-GLD-RNG",
  },
  {
    id: "3",
    name: "Blush Rose Lip Oil",
    slug: "blush-rose-lip-oil",
    description: "Nourishing, high-shine oil made from organic damask rose petals. Locks in moisture for a youthful glow without any sticky feel. Accented with natural gold flakes.",
    price: 1800,
    comparePrice: 2500,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 25,
    isFeatured: true,
    category: "Premium Cosmetics",
    sku: "SF-BLS-RSE-LPO",
  },
  {
    id: "4",
    name: "Starlight Diamond Studs",
    slug: "starlight-diamond-studs",
    description: "18k white gold studs featuring brilliant round cut conflict-free diamonds. Exceptional brilliance and classic minimalist luxury that fits perfectly for day-to-day wear or premium events.",
    price: 24500,
    comparePrice: null,
    images: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 3,
    isFeatured: true,
    category: "Fine Jewelry",
    sku: "SF-STR-DMD-STD",
  },
  {
    id: "5",
    name: "Midnight Silk Scarf",
    slug: "midnight-silk-scarf",
    description: "100% mulberry silk scarf featuring an editorial celestial print. Features hand-rolled hems and exquisite silk weave weight that drapes like fluid stardust.",
    price: 3500,
    comparePrice: 5000,
    images: [
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 12,
    isFeatured: true,
    category: "Designer Accessories",
    sku: "SF-MDN-SLK-SCF",
  },
  {
    id: "6",
    name: "Golden Hour Hoop Earrings",
    slug: "golden-hour-hoop-earrings",
    description: "Elegant textured hoop earrings handcrafted in recycled 18k gold. Captures the warm, glowing light of twilight with soft gold textures that shimmer on movement.",
    price: 6500,
    comparePrice: 9000,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 15,
    isFeatured: true,
    category: "Fine Jewelry",
    sku: "SF-GLD-HR-HPE",
  },
  {
    id: "7",
    name: "Crimson Velvet Lip Glaze",
    slug: "crimson-velvet-lip-glaze",
    description: "Premium velvet liquid lipstick in deep imperial crimson. Hydrating formula that provides a bold, ultra-luxurious matte lip statement for up to 12 hours.",
    price: 2200,
    comparePrice: 3000,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 30,
    isFeatured: true,
    category: "Premium Cosmetics",
    sku: "SF-CRM-VVT-LPG",
  },
  {
    id: "8",
    name: "Chrono Gold Timepiece",
    slug: "chrono-gold-timepiece",
    description: "Masterpiece chronograph luxury timekeeper featuring a gold-plated dial case, sapphire glass display, and premium black leather strap. Designed for true royal elegance.",
    price: 45000,
    comparePrice: 60000,
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
    ],
    stock: 2,
    isFeatured: true,
    category: "Designer Accessories",
    sku: "SF-CRN-GLD-TMP",
  },
];

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      addProduct: (product) => {
        set((state) => ({ products: [...state.products, product] }));
      },
      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          ),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "singar-products",
    }
  )
);
