"use client";

import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useProductStore } from "@/store/productStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveProduct = (id: string, name: string) => {
    deleteProduct(id);
    toast.success(`Removed ${name} from your curated catalog.`);
  };

  if (!mounted) {
    return (
      <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
        Loading Collection Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display text-[var(--color-ivory)]">Curated Collection</h1>
          <p className="text-zinc-500 font-light text-sm">Create, curate, and adjust high-end products in your boutique catalog.</p>
        </div>
        <Link href="/admin/products/add">
          <Button size="sm" className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            CREATE PRODUCT
          </Button>
        </Link>
      </div>

      {/* Catalog Table */}
      <div className="glass-card p-6 rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-light text-zinc-400">
            <thead>
              <tr className="border-b border-zinc-900 text-xs text-zinc-500 uppercase tracking-widest pb-3">
                <th className="pb-3">Product</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock Status</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-950/20 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail with storefront preview link */}
                      <Link 
                        href={`/products/${p.slug}`} 
                        target="_blank" 
                        title="Preview on storefront"
                        className="relative w-12 h-14 bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 group block"
                      >
                        <Image 
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"} 
                          alt={p.name} 
                          fill 
                          className="object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                        </div>
                      </Link>

                      {/* Interactive link to storefront view for details understanding */}
                      <Link 
                        href={`/products/${p.slug}`} 
                        target="_blank" 
                        title="Preview on storefront"
                        className="font-semibold text-[var(--color-ivory)] font-display text-base hover:text-[var(--color-gold)] transition-colors"
                      >
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-mono">{p.sku}</td>
                  <td className="py-4 text-[var(--color-gold)] font-medium">{formatPrice(p.price)}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase ${
                      p.stock > 0 
                        ? "bg-green-950/20 text-green-500 border border-green-900/30"
                        : "bg-red-950/20 text-red-500 border border-red-900/30"
                    }`}>
                      {p.stock > 0 ? `${p.stock} IN STOCK` : "OUT OF STOCK"}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-zinc-500 uppercase tracking-wider">{p.category}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Preview Storefront Icon */}
                      <Link 
                        href={`/products/${p.slug}`} 
                        target="_blank" 
                        title="Preview Storefront View"
                        className="w-8 h-8 rounded-full border border-zinc-800 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] flex items-center justify-center transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Edit Curation Link */}
                      <Link 
                        href={`/admin/products/edit/${p.id}`}
                        title="Edit Curation"
                        className="w-8 h-8 rounded-full border border-zinc-800 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] flex items-center justify-center transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Remove Curation Button */}
                      <button 
                        onClick={() => handleRemoveProduct(p.id, p.name)}
                        title="Remove Curation"
                        className="w-8 h-8 rounded-full border border-zinc-800 hover:border-red-500/50 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
