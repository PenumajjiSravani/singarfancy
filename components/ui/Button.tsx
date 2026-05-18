"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden font-semibold transition-all duration-300",
          {
            // Primary: Gold gradient with shimmer
            "bg-[var(--color-gold)] text-black hover:scale-[1.02] active:scale-[0.98]": variant === "primary",
            // Secondary: Ivory
            "bg-[var(--color-ivory)] text-black hover:bg-[#e0dcd4]": variant === "secondary",
            // Outline: Glassmorphism with gold border
            "border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black":
              variant === "outline",
            // Ghost: No background
            "text-[var(--color-ivory)] hover:text-[var(--color-gold)]": variant === "ghost",
            // Sizes
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {variant === "primary" && (
          <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
