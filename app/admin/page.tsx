"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, ShoppingBag, FolderTree, Package,
    LogOut, Settings, Menu, X, Edit, Trash2, IndianRupee,
    Clock, CheckCircle, UploadCloud, AlertTriangle, MapPin, Phone, User as UserIcon, Truck, Calendar
} from "lucide-react";

import { MOCK_ORDERS, MOCK_CUSTOMERS, SAMPLE_PRODUCTS, Order } from "@/lib/store";

type Section = "dashboard" | "products" | "orders" | "categories" | "settings";

const statusColors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    Ready: "bg-purple-100 text-purple-700 border-purple-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;
    
    const [section, setSection] = useState<Section>("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Authentication Guard
    useEffect(() => {
        setIsMounted(true);
        if (status === "unauthenticated") { router.push("/login"); return; }
        // Uncomment once role setup is verified
        // if (user && user.role !== "admin") { router.push("/dashboard"); }
    }, [user, status, router]);

    if (!isMounted || status === "loading" || !user) return <div className="min-h-screen bg-[#FDFBF7]" />;

    // Derived Stats
    const totalOrders = MOCK_ORDERS.length;
    const pendingOrders = MOCK_ORDERS.filter(o => o.status === "Processing" || o.status === "Pending").length;
    const deliveredOrders = MOCK_ORDERS.filter(o => o.status === "Delivered").length;
    const totalProducts = SAMPLE_PRODUCTS.length;
    const totalRevenue = MOCK_ORDERS.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);

    const lowStockProducts = SAMPLE_PRODUCTS.slice(0, 2); // Mocking low stock

    const navLinks = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "products", label: "Products", icon: Package },
        { id: "orders", label: "Orders", icon: ShoppingBag, badge: pendingOrders },
        { id: "categories", label: "Categories", icon: FolderTree },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const handleNav = (id: Section) => {
        setSection(id);
        setIsMobileMenuOpen(false);
    }

    return (
        <div className="min-h-screen bg-[#F8F5F0] flex">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static top-0 left-0 h-screen w-64 bg-[#1A0A0C] z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <Link href="/" className="flex flex-col">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] font-bold">Singar</span>
                        <span className="text-xl font-serif text-white italic">Admin</span>
                    </Link>
                    <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map(({ id, label, icon: Icon, badge }) => (
                        <button
                            key={id}
                            onClick={() => handleNav(id as Section)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all ${
                                section === id 
                                ? "bg-[#C5A059] text-[#1A0A0C] font-bold" 
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <span className="flex items-center gap-3"><Icon size={18} /> {label}</span>
                            {badge !== undefined && badge > 0 && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${section === id ? 'bg-[#1A0A0C] text-[#C5A059]' : 'bg-[#58181F] text-white'}`}>
                                    {badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors font-medium">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                {/* Header (Mobile) */}
                <header className="bg-white border-b border-[#F4E8D1] p-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-[#3D1014]" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-serif text-[#3D1014] capitalize">{section}</h2>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/40">
                        Welcome Back
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-6xl mx-auto">
                    
                    {/* DASHBOARD */}
                    {section === "dashboard" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                {[
                                    { label: "Total Products", value: totalProducts, icon: Package, color: "text-blue-500 bg-blue-50" },
                                    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-purple-500 bg-purple-50" },
                                    { label: "Pending", value: pendingOrders, icon: Clock, color: "text-amber-500 bg-amber-50" },
                                    { label: "Delivered", value: deliveredOrders, icon: CheckCircle, color: "text-green-500 bg-green-50" },
                                    { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-rose-500 bg-rose-50" },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-[#F4E8D1]">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                                            <s.icon size={16} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#3D1014]">{s.value}</h3>
                                        <p className="text-xs text-[#3D1014]/50 font-medium uppercase tracking-wider mt-1">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Recent Orders */}
                                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-[#F4E8D1] overflow-hidden">
                                    <div className="p-5 border-b border-[#F4E8D1] flex justify-between items-center">
                                        <h3 className="font-serif text-lg text-[#3D1014]">Recent Orders</h3>
                                        <button onClick={() => setSection("orders")} className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">View All</button>
                                    </div>
                                    <div className="p-5 text-center text-sm text-[#3D1014]/50 py-10">
                                        {MOCK_ORDERS.length > 0 ? (
                                             <table className="w-full text-left hidden md:table">
                                                <thead>
                                                    <tr className="text-[10px] uppercase text-[#3D1014]/40 border-b border-[#F4E8D1]">
                                                        <th className="pb-3 font-bold">Customer</th>
                                                        <th className="pb-3 font-bold">Amount</th>
                                                        <th className="pb-3 font-bold">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {MOCK_ORDERS.slice(0,5).map(o => (
                                                        <tr 
                                                            key={o.id} 
                                                            onClick={() => setSelectedOrder(o)}
                                                            className="border-b border-[#F4E8D1] last:border-0 text-sm text-[#3D1014] cursor-pointer hover:bg-[#F9F6F0]/50 transition-colors"
                                                        >
                                                            <td className="py-3 font-medium">{MOCK_CUSTOMERS.find(c => c.id === o.userId)?.name || "Guest"}</td>
                                                            <td className="py-3 font-bold">₹{o.total.toLocaleString("en-IN")}</td>
                                                            <td className="py-3">
                                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${statusColors[o.status] || 'bg-[#F9F6F0] border-[#F4E8D1]'}`}>
                                                                    {o.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                             </table>
                                        ) : (
                                            "No orders yet. Place a test order to see it here."
                                        )}
                                    </div>
                                </div>

                                {/* Low Stock Alert */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#F4E8D1] overflow-hidden">
                                    <div className="p-5 border-b border-[#F4E8D1]">
                                        <h3 className="font-serif text-lg text-[#3D1014] flex items-center gap-2">
                                            <AlertTriangle size={18} className="text-amber-500" /> Low Stock
                                        </h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {lowStockProducts.map(p => (
                                            <div key={p.id} className="flex gap-3 items-center">
                                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-[#3D1014] line-clamp-1">{p.name}</p>
                                                    <p className="text-xs text-amber-600 font-bold mt-0.5">Limited stock</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* PRODUCTS */}
                    {section === "products" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-center mb-6">
                                <input type="text" placeholder="Search products..." className="w-full max-w-sm px-4 py-2 border border-[#F4E8D1] rounded-lg text-sm focus:outline-none focus:border-[#C5A059]" />
                                <button onClick={() => setIsAddProductOpen(true)} className="bg-[#58181F] text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest hidden md:block hover:bg-[#3D1014] transition-colors">
                                    + Add Product
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-[#F4E8D1] overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead className="border-b border-[#F4E8D1] bg-[#FDFBF7]">
                                        <tr className="text-[10px] uppercase text-[#3D1014]/60 font-bold">
                                            <th className="px-5 py-4">Image</th>
                                            <th className="px-5 py-4">Product</th>
                                            <th className="px-5 py-4">Category</th>
                                            <th className="px-5 py-4">Price</th>
                                            <th className="px-5 py-4">Stock</th>
                                            <th className="px-5 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SAMPLE_PRODUCTS.map(p => (
                                            <tr key={p.id} className="border-b border-[#F4E8D1] last:border-0 hover:bg-[#F9F6F0]/50 transition-colors">
                                                <td className="px-5 py-3">
                                                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover border border-[#F4E8D1]" />
                                                </td>
                                                <td className="px-5 py-3">
                                                    <p className="text-sm font-medium text-[#3D1014]">{p.name}</p>
                                                    <p className="text-xs text-[#3D1014]/50 mt-0.5 line-clamp-1">{p.category}</p>
                                                </td>
                                                <td className="px-5 py-3 text-xs text-[#3D1014]/70">{p.category} / {p.subcategory}</td>
                                                <td className="px-5 py-3 font-bold text-sm text-[#3D1014]">₹{p.price}</td>
                                                <td className="px-5 py-3 text-sm text-[#3D1014]">In Stock</td>
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-3 justify-center text-[#3D1014]/40">
                                                        <button className="hover:text-[#C5A059]"><Edit size={16} /></button>
                                                        <button className="hover:text-red-500"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Mobile Add Product FAB */}
                            <button onClick={() => setIsAddProductOpen(true)} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#58181F] text-white rounded-full flex items-center justify-center shadow-lg z-20 hover:bg-[#3D1014] transition-colors">
                                <Package size={24} />
                            </button>
                        </motion.div>
                    )}

                    {/* ORDERS */}
                    {section === "orders" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                                {["All", "Pending", "Confirmed", "Ready", "Delivered", "Canceled"].map(t => (
                                    <button key={t} className="px-4 py-2 border border-[#F4E8D1] rounded-lg text-xs font-bold uppercase tracking-wider text-[#3D1014]/60 whitespace-nowrap hover:bg-[#F4E8D1] focus:bg-[#58181F] focus:text-white">
                                        {t}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-[#F4E8D1] overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead className="border-b border-[#F4E8D1] bg-[#FDFBF7]">
                                        <tr className="text-[10px] uppercase text-[#3D1014]/60 font-bold">
                                            <th className="px-5 py-4">Customer</th>
                                            <th className="px-5 py-4">Products</th>
                                            <th className="px-5 py-4">Amount</th>
                                            <th className="px-5 py-4">Type</th>
                                            <th className="px-5 py-4 w-32">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_ORDERS.map(o => (
                                            <tr 
                                                key={o.id} 
                                                onClick={() => setSelectedOrder(o)}
                                                className="border-b border-[#F4E8D1] last:border-0 hover:bg-[#F9F6F0]/50 cursor-pointer transition-colors"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-[#3D1014]">{MOCK_CUSTOMERS.find(c => c.id === o.userId)?.name || "Guest"}</p>
                                                    <p className="text-xs text-[#3D1014]/40">{o.id}</p>
                                                </td>
                                                <td className="px-5 py-4 text-xs text-[#3D1014]/70 uppercase tracking-widest">{o.products.length} Items</td>
                                                <td className="px-5 py-4 font-bold text-sm text-[#3D1014]">₹{o.total.toLocaleString("en-IN")}</td>
                                                <td className="px-5 py-4 text-xs text-[#3D1014]/70">Delivery</td>
                                                <td className="px-5 py-4">
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${statusColors[o.status] || 'bg-[#F9F6F0] border-[#F4E8D1]'}`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* CATEGORIES */}
                    {section === "categories" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-6">
                            {/* Fancy */}
                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#F4E8D1]">
                                <div className="p-4 border-b border-[#F4E8D1] flex justify-between items-center">
                                    <h3 className="font-serif text-lg text-[#3D1014]">Fancy</h3>
                                    <button className="text-red-400 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14}/></button>
                                </div>
                                <div className="p-4">
                                    <p className="text-[10px] uppercase tracking-widest text-[#3D1014]/40 font-bold mb-3">Subcategories</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {["Earrings", "Bangles", "Necklaces", "Hair Accessories"].map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-[#F9F6F0] border border-[#F4E8D1] text-[#3D1014] text-xs font-medium rounded-md flex items-center gap-2">
                                                {s} <X size={12} className="opacity-40 hover:opacity-100 cursor-pointer"/>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Add subcategory..." className="flex-1 px-3 py-2 border border-[#F4E8D1] rounded text-sm outline-none focus:border-[#C5A059]" />
                                        <button className="bg-[#58181F] text-white px-4 text-xs font-bold rounded">ADD</button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Cosmetics */}
                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#F4E8D1]">
                                <div className="p-4 border-b border-[#F4E8D1] flex justify-between items-center">
                                    <h3 className="font-serif text-lg text-[#3D1014]">Cosmetics</h3>
                                    <button className="text-red-400 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14}/></button>
                                </div>
                                <div className="p-4">
                                    <p className="text-[10px] uppercase tracking-widest text-[#3D1014]/40 font-bold mb-3">Subcategories</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {["Lips", "Fragrance", "Eyes", "Skincare"].map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-[#F9F6F0] border border-[#F4E8D1] text-[#3D1014] text-xs font-medium rounded-md flex items-center gap-2">
                                                {s} <X size={12} className="opacity-40 hover:opacity-100 cursor-pointer"/>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Add subcategory..." className="flex-1 px-3 py-2 border border-[#F4E8D1] rounded text-sm outline-none focus:border-[#C5A059]" />
                                        <button className="bg-[#58181F] text-white px-4 text-xs font-bold rounded">ADD</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SETTINGS */}
                    {section === "settings" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
                            <div className="bg-white rounded-xl shadow-sm border border-[#F4E8D1] p-6">
                                <h3 className="font-serif text-lg text-[#3D1014] mb-4">Shop Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-1.5 block">Shop Name</label>
                                        <input type="text" defaultValue="Singar Fancy" className="w-full px-4 py-2 border border-[#F4E8D1] rounded focus:outline-none focus:border-[#C5A059]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-1.5 block">WhatsApp Number</label>
                                        <input type="text" defaultValue="+91 90000 00000" className="w-full px-4 py-2 border border-[#F4E8D1] rounded focus:outline-none focus:border-[#C5A059]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-1.5 block">Store Address</label>
                                        <textarea rows={3} defaultValue="Main Bazaar Road, Your City" className="w-full px-4 py-2 border border-[#F4E8D1] rounded focus:outline-none focus:border-[#C5A059] resize-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-[#F4E8D1] p-6 flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-1.5 block">Delivery Charge (₹)</label>
                                    <input type="number" defaultValue="99" className="w-full px-4 py-2 border border-[#F4E8D1] rounded focus:outline-none focus:border-[#C5A059]" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-1.5 block">Free Delivery Above (₹)</label>
                                    <input type="number" defaultValue="999" className="w-full px-4 py-2 border border-[#F4E8D1] rounded focus:outline-none focus:border-[#C5A059]" />
                                </div>
                            </div>
                            
                            <button className="bg-[#58181F] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md">
                                Save Changes
                            </button>
                        </motion.div>
                    )}

                </div>
            </main>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-[#3D1014]/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-[101]"
                        >
                            {/* Header */}
                            <div className="p-5 border-b border-[#F4E8D1] flex items-center justify-between bg-white text-[#3D1014]">
                                <div>
                                    <h2 className="text-xl font-serif">Order Details</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">{selectedOrder.id}</span>
                                        <span className="text-[#F4E8D1]">|</span>
                                        <span className="text-[10px] text-[#3D1014]/40 flex items-center gap-1">
                                            <Calendar size={10} /> {new Date(selectedOrder.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-[#F4E8D1] rounded-full transition-colors">
                                    <X size={20} className="text-[#3D1014]/40" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Customer Info */}
                                    <section>
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-4 flex items-center gap-2">
                                            <UserIcon size={14} /> Customer Details
                                        </h3>
                                        <div className="space-y-3 bg-white p-4 rounded-xl border border-[#F4E8D1]">
                                            <div>
                                                <p className="text-[9px] uppercase text-[#3D1014]/40 font-bold tracking-widest mb-0.5">Name</p>
                                                <p className="text-sm font-medium text-[#3D1014]">
                                                    {MOCK_CUSTOMERS.find(c => c.id === selectedOrder.userId)?.name || "Guest Customer"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase text-[#3D1014]/40 font-bold tracking-widest mb-0.5">Phone</p>
                                                <p className="text-sm font-medium text-[#3D1014]">
                                                    {MOCK_CUSTOMERS.find(c => c.id === selectedOrder.userId)?.phone || "+91 98765 43210"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase text-[#3D1014]/40 font-bold tracking-widest mb-0.5">Address</p>
                                                <div className="flex gap-2 text-sm text-[#3D1014]/70 leading-snug">
                                                    <MapPin size={14} className="flex-shrink-0 mt-0.5 text-[#C5A059]" />
                                                    {selectedOrder.address}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Order Type & Status */}
                                    <section className="space-y-6">
                                        <div>
                                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-4 flex items-center gap-2">
                                                <Truck size={14} /> Delivery Type
                                            </h3>
                                            <div className="bg-white p-3 rounded-xl border border-[#F4E8D1] flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#F9F6F0] flex items-center justify-center text-[#C5A059]">
                                                    <Truck size={16} />
                                                </div>
                                                <span className="text-sm font-medium text-[#3D1014]">Standard Delivery</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-4">Update Status</h3>
                                            <select 
                                                defaultValue={selectedOrder.status}
                                                className={`w-full text-xs font-bold border rounded-lg px-3 py-2.5 outline-none transition-all ${statusColors[selectedOrder.status] || 'border-[#F4E8D1] bg-white'}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Ready">Ready</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </section>
                                </div>

                                {/* Products */}
                                <section>
                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-4 flex items-center gap-2">
                                        <Package size={14} /> Ordered Products
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedOrder.products.map((item, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-[#F4E8D1] flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-[#F4E8D1]" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-[#3D1014] truncate">{item.name}</p>
                                                    <p className="text-[10px] text-[#3D1014]/40 mt-0.5 uppercase tracking-wider">{item.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-[#3D1014]">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                                                    <p className="text-[10px] text-[#3D1014]/40">{item.qty} × ₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Payment Summary */}
                                <section className="p-5 bg-white rounded-2xl border border-[#F4E8D1]">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#3D1014]/40">Subtotal</span>
                                            <span className="font-medium text-[#3D1014]">₹{(selectedOrder.total - 50).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#3D1014]/40">Delivery Charge</span>
                                            <span className="font-medium text-[#3D1014]">₹50</span>
                                        </div>
                                        <div className="pt-3 border-t border-[#F4E8D1] flex justify-between items-center">
                                            <span className="font-serif text-[#3D1014]">Total Amount</span>
                                            <span className="text-xl font-serif text-[#58181F]">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer / Quick Actions */}
                            <div className="p-5 bg-white border-t border-[#F4E8D1] grid grid-cols-3 gap-3">
                                <button className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors">
                                    <CheckCircle size={14} /> Confirm
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-purple-100 transition-colors">
                                    <Package size={14} /> Ready
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-green-100 transition-colors">
                                    <Truck size={14} /> Delivered
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Product Modal */}
            <AnimatePresence>
                {isAddProductOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsAddProductOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[#F4E8D1] flex justify-between items-center bg-[#FDFBF7]">
                                <h2 className="font-serif text-xl text-[#3D1014]">New Product</h2>
                                <button onClick={() => setIsAddProductOpen(false)} className="text-[#3D1014]/50 hover:text-[#3D1014]">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* Image */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">Image</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-28 h-28 bg-[#F9F6F0] border border-[#F4E8D1] flex flex-col items-center justify-center text-[#3D1014]/40 rounded-md">
                                            <span className="text-[10px] font-bold mt-1">No image</span>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <button className="bg-[#F9F6F0] border border-[#F4E8D1] px-4 py-2 rounded flex items-center gap-2 text-xs font-bold text-[#3D1014] hover:bg-[#F4E8D1]">
                                                <UploadCloud size={14} /> Upload
                                            </button>
                                            <input type="text" placeholder="or paste Image URL" className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Name & Stock */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">Stock</label>
                                        <input type="number" defaultValue="0" className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059]" />
                                    </div>
                                </div>

                                {/* Price & MRP */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">Price (₹)</label>
                                        <input type="number" defaultValue="0" className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">MRP (₹) — Optional</label>
                                        <input type="number" className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059]" />
                                    </div>
                                </div>

                                {/* Category & Subcategory */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">Category</label>
                                        <select className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059] bg-white">
                                            <option>Fancy</option>
                                            <option>Cosmetics</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">Subcategory</label>
                                        <select className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059] bg-white">
                                            <option>Select...</option>
                                            <option>Earrings</option>
                                            <option>Bangles</option>
                                            <option>Necklaces</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3D1014]/60 mb-2 block">Description</label>
                                    <textarea rows={3} className="w-full px-4 py-2 border border-[#F4E8D1] rounded text-sm focus:outline-none focus:border-[#C5A059] resize-none"></textarea>
                                </div>
                            </div>

                            <div className="p-5 border-t border-[#F4E8D1] flex justify-end gap-3 bg-[#FDFBF7]">
                                <button onClick={() => setIsAddProductOpen(false)} className="px-5 py-2 border border-[#F4E8D1] rounded text-sm font-bold text-[#3D1014]/60 hover:bg-[#F4E8D1] transition-colors">
                                    Cancel
                                </button>
                                <button className="px-6 py-2 bg-[#58181F] text-white rounded text-sm font-bold shadow-md hover:bg-[#3D1014] transition-colors">
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
