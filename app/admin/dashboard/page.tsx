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
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-ivory wrap-break-word">Curator Dashboard</h1>
          <p className="text-zinc-500 font-light text-xs sm:text-sm mt-1 sm:mt-2">Managing the fine collections of Singar Fancy boutique.</p>
        </div>
        <div className="flex gap-2 sm:gap-4 shrink-0">
          <Link href="/admin/products/add" className="w-full sm:w-auto">
            <Button size="sm" className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">ADD CURATED ITEM</span>
              <span className="sm:hidden">ADD</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-card p-4 sm:p-5 md:p-6 rounded-sm flex flex-col justify-between h-auto sm:h-40 min-h-32">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-widest line-clamp-2">{stat.name}</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-gold shrink-0">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mt-3 sm:mt-2">
                <h3 className="text-lg sm:text-2xl font-semibold text-ivory font-display wrap-break-word">
                  {typeof stat.value === "number" && stat.name.includes("Revenue")
                    ? formatPrice(stat.value)
                    : stat.value}
                </h3>
                <span className="text-[9px] sm:text-[10px] text-green-500 font-semibold tracking-wider block mt-1 sm:mt-2">
                  {stat.change} vs Last Month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity / Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Table */}
        <div className="lg:col-span-2 glass-card p-4 sm:p-5 md:p-6 rounded-sm space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h3 className="font-display text-base sm:text-lg text-ivory tracking-wide uppercase">Recent Commissions</h3>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold self-start sm:self-center whitespace-nowrap">
              View All
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-4 sm:-mx-5 md:-mx-6 px-4 sm:px-5 md:px-6">
            <table className="w-full text-left text-xs sm:text-sm font-light text-zinc-400 min-w-full">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest">
                  <th className="pb-3 pr-2 sm:pr-4 font-medium">Order ID</th>
                  <th className="pb-3 pr-2 sm:pr-4 font-medium hidden sm:table-cell">Client</th>
                  <th className="pb-3 pr-2 sm:pr-4 font-medium">Total</th>
                  <th className="pb-3 pr-2 sm:pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-950/20 transition-colors">
                    <td className="py-3 sm:py-4 pr-2 sm:pr-4 font-semibold text-ivory text-xs sm:text-sm truncate">{order.id}</td>
                    <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-xs sm:text-sm hidden sm:table-cell">{order.client}</td>
                    <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-gold font-medium text-xs sm:text-sm">{formatPrice(order.total)}</td>
                    <td className="py-3 sm:py-4 pr-2 sm:pr-4">
                      <span className={`text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase border inline-block ${
                        order.status === "DELIVERED"
                          ? "border-green-900/30 text-green-500 bg-green-950/20"
                          : order.status === "PROCESSING"
                          ? "border-yellow-900/30 text-yellow-500 bg-yellow-950/20"
                          : "border-border text-gold"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 text-[9px] sm:text-xs text-zinc-500 hidden md:table-cell whitespace-nowrap">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Custom Curator Promise panel */}
        <div className="glass-card p-4 sm:p-5 md:p-6 rounded-sm space-y-4 sm:space-y-6 flex flex-col justify-between bg-zinc-950/30">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-display text-base sm:text-lg text-ivory tracking-wide uppercase border-b border-zinc-900 pb-2 sm:pb-3">Curator Focus</h3>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-light text-zinc-400 leading-relaxed">
              <p>As Singar Fancy's grand curator, you oversee premium luxury acquisitions and client order dispatch tracking.</p>
              <div className="border border-zinc-900 p-3 sm:p-4 rounded-sm bg-zinc-950 flex flex-col gap-2">
                <span className="font-semibold text-[10px] sm:text-xs uppercase tracking-widest text-gold">Quick Tip</span>
                <span className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed">Always check tags when adding items to ensure they properly display under collections and navigation.</span>
              </div>
            </div>
          </div>
          <div className="pt-3 sm:pt-4 md:pt-6">
            <Link href="/admin/products/add" className="block w-full">
              <Button size="md" variant="outline" className="w-full justify-center text-[10px] sm:text-xs tracking-widest font-bold">
                <span className="hidden sm:inline">LAUNCH NEW PRODUCT WIZARD</span>
                <span className="sm:hidden">NEW PRODUCT</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
