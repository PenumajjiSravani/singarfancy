"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, FolderTree, ClipboardList, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAdmin()) {
      router.push("/login");
    }
  }, [isAdmin, router]);

  if (!mounted || !isAdmin()) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center pt-24 text-zinc-500 font-light text-sm uppercase tracking-widest">
        Restricted Access. Redirecting to Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] flex flex-col md:flex-row pt-24">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-900 bg-zinc-950/80 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-6">
            <ShieldCheck className="w-5 h-5 text-[var(--color-gold)]" />
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-[var(--color-ivory)]">SINGAR PORTAL</h2>
              <span className="text-[10px] text-zinc-500 font-light tracking-widest uppercase">Grand Curator</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 text-sm font-light tracking-wide rounded-sm transition-all duration-300",
                    isActive
                      ? "bg-[var(--color-gold)] text-black font-semibold shadow-lg shadow-[var(--color-gold)]/10"
                      : "text-zinc-400 hover:text-[var(--color-gold)] hover:bg-zinc-900/30"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-900 pt-6 mt-8 space-y-4">
          <Link
            href="/admin/settings"
            className="flex items-center gap-4 px-4 py-2 text-xs font-light text-zinc-500 hover:text-[var(--color-gold)] transition-colors"
          >
            <Settings className="w-4 h-4 shrink-0" />
            Curator Settings
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-4 px-4 py-2 text-xs font-light text-red-500/80 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
