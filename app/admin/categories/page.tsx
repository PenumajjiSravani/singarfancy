"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Sparkles } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { categories, addCategory, deleteCategory } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = (data: CategoryFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newCat = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        description: data.description,
      };
      addCategory(newCat);
      reset();
      toast.success(`${data.name} curated successfully!`);
    }, 1000);
  };

  const removeCategory = (id: string, name: string) => {
    deleteCategory(id);
    toast.success(`Removed category ${name}`);
  };

  if (!mounted) {
    return (
      <div className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">
        Loading Categories Portal...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display text-[var(--color-ivory)]">Curate Categories</h1>
        <p className="text-zinc-500 font-light text-sm">Classify luxury fancy products into dedicated editorial sections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Add Form */}
        <div className="glass-card p-8 rounded-sm space-y-6">
          <h3 className="font-display text-lg text-[var(--color-ivory)] border-b border-zinc-900 pb-3 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
            Curate Section
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Name</label>
              <input
                {...register("name")}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full text-xs font-bold tracking-widest uppercase">
              {isSubmitting ? "CURATING SECTION..." : "CREATE CATEGORY"}
            </Button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 glass-card p-6 rounded-sm space-y-6">
          <h3 className="font-display text-lg text-[var(--color-ivory)] border-b border-zinc-900 pb-3 uppercase tracking-wide">Existing Classifications</h3>
          
          <div className="divide-y divide-zinc-900">
            {categories.map((cat) => (
              <div key={cat.id} className="flex justify-between items-center py-4 hover:bg-zinc-950/10 transition-colors px-2">
                <div>
                  <h4 className="font-display text-lg text-[var(--color-ivory)] hover:text-[var(--color-gold)] transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-zinc-500 font-light mt-1">
                    {cat.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-zinc-800 hover:border-red-500/50 hover:text-red-500 flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" onClick={() => removeCategory(cat.id, cat.name)} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
