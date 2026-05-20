"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  comparePrice: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const { products, updateProduct } = useProductStore();
  const { categories } = useCategoryStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [mounted, setMounted] = useState(false);

  // Look up the product in the persisted store
  const existingProduct = products.find((p) => p.id === productId);

  useEffect(() => {
    setMounted(true);
    if (existingProduct) {
      setImages(existingProduct.images || []);
    }
  }, [existingProduct]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: existingProduct?.name || "",
      slug: existingProduct?.slug || "",
      description: existingProduct?.description || "",
      price: existingProduct?.price || 0,
      comparePrice: existingProduct?.comparePrice || null,
      stock: existingProduct?.stock || 0,
      sku: existingProduct?.sku || "",
      category: existingProduct?.category || categories[0]?.name || "Fine Jewelry",
      tags: existingProduct?.tags || "",
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", generatedSlug);
  };

  const handleAddCustomImage = () => {
    if (!customImageUrl) {
      toast.error("Please enter a valid image URL");
      return;
    }
    if (!customImageUrl.startsWith("http://") && !customImageUrl.startsWith("https://")) {
      toast.error("Image URL must start with http:// or https://");
      return;
    }
    
    setImages([...images, customImageUrl]);
    setCustomImageUrl("");
    toast.success("Premium custom media asset added!");
  };

  const handleImageUploadPreset = () => {
    const luxuryImages = [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop"
    ];
    
    const unusedImages = luxuryImages.filter(img => !images.includes(img));
    if (unusedImages.length === 0) {
      toast.error("All pre-loaded luxury assets are currently added!");
      return;
    }
    
    const randomImg = unusedImages[Math.floor(Math.random() * unusedImages.length)];
    setImages([...images, randomImg]);
    toast.success("Luxury preset asset loaded successfully!");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    // 3 Images Min Count Checkpoint
    if (images.length < 3) {
      toast.error(`Curation Checkpoint: A minimum of 3 premium images is required (Current: ${images.length}).`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      updateProduct(productId, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice || null,
        stock: data.stock,
        sku: data.sku,
        category: data.category,
        images: images,
      });
      setIsSubmitting(false);
      toast.success(`${data.name} curation details updated successfully!`);
      router.push("/admin/products");
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
        Loading Curation Editor...
      </div>
    );
  }

  if (!existingProduct) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <p className="text-red-500 uppercase tracking-widest font-semibold text-sm">Product Curation Record Not Found</p>
        <Link href="/admin/products" className="text-xs text-[var(--color-gold)] hover:underline uppercase tracking-widest font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Breadcrumb / Title */}
      <div className="space-y-4">
        <Link href="/admin/products" className="text-xs text-zinc-500 hover:text-[var(--color-gold)] flex items-center gap-2 transition-colors uppercase tracking-widest font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog
        </Link>
        <div>
          <h1 className="text-3xl font-display text-[var(--color-ivory)]">Edit Curation Details</h1>
          <p className="text-zinc-500 font-light text-sm">Modify existing fields, stock details, and image arrays for this masterwork.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-2 glass-card p-8 rounded-sm space-y-6">
          <h3 className="font-display text-lg text-[var(--color-ivory)] border-b border-zinc-900 pb-3 uppercase tracking-wide">Product Details</h3>
          
          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Name</label>
            <input
              {...register("name")}
              onChange={handleNameChange}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Slug (Auto-generated)</label>
            <input
              {...register("slug")}
              className="w-full bg-zinc-950 border border-zinc-800 text-sm px-4 py-3 text-zinc-500 outline-none transition-colors rounded-none cursor-not-allowed"
              readOnly
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Description</label>
            <textarea
              {...register("description")}
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none resize-none font-light leading-relaxed"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Price (INR)</label>
              <input
                {...register("price")}
                type="number"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Compare Price (INR)</label>
              <input
                {...register("comparePrice")}
                type="number"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.comparePrice && <p className="text-red-500 text-xs mt-1">{errors.comparePrice.message}</p>}
            </div>
          </div>
        </div>

        {/* Right Side: Media Assets, Category, Publish */}
        <div className="space-y-8">
          {/* Media upload */}
          <div className="glass-card p-6 rounded-sm space-y-4">
            <h3 className="font-display text-base text-[var(--color-ivory)] border-b border-zinc-900 pb-2 uppercase tracking-wider">Acquisitions Media</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 block uppercase tracking-widest font-semibold">Paste Image URL Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-850 outline-none px-3 py-2 text-xs text-[var(--color-ivory)] rounded-none placeholder:text-zinc-700 text-ellipsis"
                />
                <button
                  type="button"
                  onClick={handleAddCustomImage}
                  className="px-3 bg-[var(--color-gold)] text-black font-semibold text-xs flex items-center justify-center cursor-pointer hover:bg-[var(--color-gold-hover)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Or use Luxury Preset</span>
              <button
                type="button"
                onClick={handleImageUploadPreset}
                className="text-[10px] text-[var(--color-gold)] uppercase tracking-widest font-semibold hover:underline cursor-pointer"
              >
                Auto Preset
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/5] bg-zinc-950 border border-zinc-900 overflow-hidden">
                  <img src={img} alt="preview" className="object-cover w-full h-full" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <div
                  className="aspect-[4/5] bg-zinc-950 border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 text-zinc-600 rounded-none"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[9px] uppercase font-bold tracking-widest">Slot {images.length + 1}</span>
                </div>
              )}
            </div>
            <div className="border-t border-zinc-900 pt-3">
              <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                <strong className="text-red-400 uppercase tracking-wider font-semibold">Checkpoint Requirement: </strong> 
                At least <strong className="text-[var(--color-gold)]">3 premium curation images</strong> are required to save changes. 
                Current count: <span className="font-bold text-[var(--color-ivory)]">{images.length}/3</span>.
              </p>
            </div>
          </div>

          {/* Settings / Meta */}
          <div className="glass-card p-6 rounded-sm space-y-6">
            <h3 className="font-display text-base text-[var(--color-ivory)] border-b border-zinc-900 pb-2 uppercase tracking-wider">Classification</h3>
            
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Category</label>
              <select
                {...register("category")}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">SKU</label>
                <input
                  {...register("sku")}
                  placeholder="e.g. SF-GLD-01"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-3 py-2 text-xs text-[var(--color-ivory)] transition-colors rounded-none placeholder:text-zinc-700"
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Stock</label>
                <input
                  {...register("stock")}
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-3 py-2 text-xs text-[var(--color-ivory)] transition-colors rounded-none"
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full py-4 text-xs font-bold tracking-widest uppercase cursor-pointer">
            {isSubmitting ? "COMMITING CHANGES..." : "SAVE CURATION CHANGES"}
          </Button>
        </div>
      </form>
    </div>
  );
}
