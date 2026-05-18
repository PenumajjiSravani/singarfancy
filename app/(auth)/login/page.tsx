"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    // Simulate login logic
    setTimeout(() => {
      setIsSubmitting(false);
      login(data.email, data.email.startsWith("admin") ? "Grand Curator" : "Valued Client");
      
      // Granting ADMIN role simulation for full walkthrough purposes
      if (data.email.startsWith("admin")) {
        toast.success("Welcome back, Grand Curator (ADMIN)!");
        router.push("/admin/dashboard");
      } else {
        toast.success("Welcome back, valued client!");
        router.push("/");
      }
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md glass-card p-8 rounded-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[var(--color-gold)] tracking-[0.2em] text-xs font-semibold uppercase block">
            Exclusive Access
          </span>
          <h1 className="text-3xl font-display text-[var(--color-ivory)]">
            Client Portal
          </h1>
          <p className="text-zinc-500 font-light text-sm">
            Sign in to experience luxury fancy shopping and manage your selections.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-xs text-zinc-500 block mb-2 uppercase tracking-widest">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. name@gmail.com"
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
            {isSubmitting ? "AUTHORIZING ACCESS..." : "SIGN IN"}
          </Button>
        </form>

        <div className="text-center text-xs font-light text-zinc-500">
          <span>Don't have an account? </span>
          <Link href="/register" className="text-[var(--color-gold)] hover:underline font-semibold transition-colors">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
