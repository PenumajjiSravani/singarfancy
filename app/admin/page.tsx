"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, ShoppingBag, FolderTree, Package,
    LogOut, Settings, Menu, X, Edit, Trash2, IndianRupee,
    Clock, CheckCircle, UploadCloud, AlertTriangle
} from "lucide-react";

import { MOCK_ORDERS, MOCK_CUSTOMERS, SAMPLE_PRODUCTS } from "@/lib/store";

type Section = "dashboard" | "products" | "orders" | "categories" | "settings";

export default function AdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;
    
    const [section, setSection] = useState<Section>("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    // Authentication Guard
    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        // Uncomment once role setup is verified
        // if (user && user.role !== "admin") { router.push("/dashboard"); }
    }, [user, status, router]);

    if (status === "loading" || !user) return <div className="min-h-screen bg-[#FDFBF7]" />;

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
                                                        <tr key={o.id} className="border-b border-[#F4E8D1] last:border-0 text-sm text-[#3D1014]">
                                                            <td className="py-3 font-medium">{MOCK_CUSTOMERS.find(c => c.id === o.userId)?.name || "Guest"}</td>
                                                            <td className="py-3 font-bold">₹{o.total.toLocaleString("en-IN")}</td>
                                                            <td className="py-3">
                                                                <span className="text-[10px] px-2 py-1 bg-[#F9F6F0] rounded-full font-bold">{o.status}</span>
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
                                                    <p className="text-xs text-amber-600 font-bold mt-0.5">{Math.floor(Math.random() * 4) + 1} left</p>
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
                                                <td className="px-5 py-3 text-sm text-[#3D1014]">{Math.floor(Math.random() * 20)+1}</td>
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
                                            <tr key={o.id} className="border-b border-[#F4E8D1] last:border-0 hover:bg-[#F9F6F0]/50">
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-[#3D1014]">{MOCK_CUSTOMERS.find(c => c.id === o.userId)?.name || "Guest"}</p>
                                                    <p className="text-xs text-[#3D1014]/40">{o.id}</p>
                                                </td>
                                                <td className="px-5 py-4 text-xs text-[#3D1014]/70 uppercase tracking-widest">{o.products.length} Items</td>
                                                <td className="px-5 py-4 font-bold text-sm text-[#3D1014]">₹{o.total.toLocaleString("en-IN")}</td>
                                                <td className="px-5 py-4 text-xs text-[#3D1014]/70">Delivery</td>
                                                <td className="px-5 py-4">
                                                    <select className="w-full text-xs font-bold border border-[#F4E8D1] rounded px-2 py-1 outline-none text-[#3D1014]">
                                                        <option>Pending</option>
                                                        <option>Confirmed</option>
                                                        <option>Ready</option>
                                                        <option>Delivered</option>
                                                    </select>
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
