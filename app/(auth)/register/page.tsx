"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    // Simulate register
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Account created successfully! Welcome to Singar Fancy.");
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md glass-card p-8 rounded-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase block">
            Become a Member
          </span>
          <h1 className="text-3xl font-display text-[var(--color-ivory)]">
            Create Account
          </h1>
          <p className="text-zinc-500 font-light text-sm">
            Join Singar Fancy to curate your private wishlist and check out seamlessly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Full Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Radhika Sharma"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none placeholder:text-zinc-700"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. radhika@gmail.com"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none placeholder:text-zinc-700"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[var(--color-gold)] outline-none px-4 py-3 text-sm text-[var(--color-ivory)] transition-colors rounded-none placeholder:text-zinc-700"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full mt-4">
            {isSubmitting ? "CREATING PROFILE..." : "REGISTER"}
          </Button>
        </form>

        <div className="text-center text-xs font-light text-zinc-500">
          <span>Already have an account? </span>
          <Link href="/login" className="text-[var(--color-gold)] hover:underline font-semibold transition-colors">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}
