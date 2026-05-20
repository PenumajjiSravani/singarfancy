import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingCart, Gem, Users, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const stats = [
  {
    name: "Total Revenue",
    value: 843900,
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    name: "Orders Today",
    value: 24,
    change: "+18.2%",
    changeType: "positive",
    icon: ShoppingCart,
  },
  {
    name: "Active Curated Items",
    value: 128,
    change: "+4.1%",
    changeType: "positive",
    icon: Gem,
  },
  {
    name: "Valued Clients",
    value: 1420,
    change: "+8.9%",
    changeType: "positive",
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "#SF-8930",
    client: "Aditi Rao Hydari",
    total: 37500,
    status: "PROCESSING",
    date: "May 18, 2026",
  },
  {
    id: "#SF-8929",
    client: "Ranveer Singh",
    total: 45000,
    status: "SHIPPED",
    date: "May 18, 2026",
  },
  {
    id: "#SF-8928",
    client: "Kareena Kapoor",
    total: 12500,
    status: "DELIVERED",
    date: "May 17, 2026",
  },
  {
    id: "#SF-8927",
    client: "Deepika Padukone",
    total: 24500,
    status: "CONFIRMED",
    date: "May 17, 2026",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display text-[var(--color-ivory)]">Curator Dashboard</h1>
          <p className="text-zinc-500 font-light text-sm">Managing the fine collections of Singar Fancy boutique.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/products/add">
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              ADD CURATED ITEM
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-card p-6 rounded-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{stat.name}</span>
                <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[var(--color-gold)]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[var(--color-ivory)] font-display mt-2">
                  {typeof stat.value === "number" && stat.name.includes("Revenue")
                    ? formatPrice(stat.value)
                    : stat.value}
                </h3>
                <span className="text-[10px] text-green-500 font-semibold tracking-wider block mt-1">
                  {stat.change} vs Last Month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity / Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[var(--color-ivory)] tracking-wide uppercase">Recent Commissions</h3>
            <Link href="/admin/orders" className="text-xs text-[var(--color-gold)] hover:underline flex items-center gap-1 font-semibold">
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-light text-zinc-400">
              <thead>
                <tr className="border-b border-zinc-900 text-xs text-zinc-500 uppercase tracking-widest">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Commission Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-950/20 transition-colors">
                    <td className="py-4 font-semibold text-[var(--color-ivory)]">{order.id}</td>
                    <td className="py-4">{order.client}</td>
                    <td className="py-4 text-[var(--color-gold)] font-medium">{formatPrice(order.total)}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase border ${
                        order.status === "DELIVERED"
                          ? "border-green-900/30 text-green-500 bg-green-950/20"
                          : order.status === "PROCESSING"
                          ? "border-yellow-900/30 text-yellow-500 bg-yellow-950/20"
                          : "border-[var(--border)] text-[var(--color-gold)]"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-zinc-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Custom Curator Promise panel */}
        <div className="glass-card p-6 rounded-sm space-y-6 flex flex-col justify-between bg-zinc-950/30">
          <div className="space-y-4">
            <h3 className="font-display text-lg text-[var(--color-ivory)] tracking-wide uppercase border-b border-zinc-900 pb-3">Curator Focus</h3>
            <div className="space-y-4 text-sm font-light text-zinc-400 leading-relaxed">
              <p>As Singar Fancy's grand curator, you oversee premium luxury acquisitions and client order dispatch tracking.</p>
              <div className="border border-zinc-900 p-4 rounded-sm bg-zinc-950 flex flex-col gap-2">
                <span className="font-semibold text-xs uppercase tracking-widest text-[var(--color-gold)]">Quick Tip</span>
                <span className="text-xs text-zinc-500 leading-relaxed">Always check tags when adding items to ensure they properly display under collections and navigation.</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Link href="/admin/products/add" className="block w-full">
              <Button size="md" variant="outline" className="w-full justify-center text-xs tracking-widest font-bold">
                LAUNCH NEW PRODUCT WIZARD
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
