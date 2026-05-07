import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
    id: string;
    name: string;
    price: number;
    mrp: number;
    description: string;
    image: string;
    category: "fancy" | "cosmetics";
    subcategory: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin";
    avatar?: string;
    joinDate: string;
}

export interface Order {
    id: string;
    userId: string;
    products: { name: string; image: string; price: number; qty: number; category: string }[];
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    date: string;
    address: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface StoreState {
    cart: CartItem[];
    wishlist: string[];
    user: User | null;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    toggleWishlist: (productId: string) => void;
    clearCart: () => void;
    login: (user: User) => void;
    logout: () => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            cart: [],
            wishlist: [],
            user: null,
            addToCart: (product) =>
                set((state) => {
                    const existing = state.cart.find((item) => item.id === product.id);
                    if (existing) {
                        return {
                            cart: state.cart.map((item) =>
                                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                            ),
                        };
                    }
                    return { cart: [...state.cart, { ...product, quantity: 1 }] };
                }),
            removeFromCart: (productId) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    cart: state.cart
                        .map((item) =>
                            item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
                        )
                        .filter((item) => item.quantity > 0),
                })),
            toggleWishlist: (productId) =>
                set((state) => ({
                    wishlist: state.wishlist.includes(productId)
                        ? state.wishlist.filter((id) => id !== productId)
                        : [...state.wishlist, productId],
                })),
            clearCart: () => set({ cart: [] }),
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        { name: "singar-fancy-storage" }
    )
);

export const SAMPLE_PRODUCTS: Product[] = [
    { id: "f1", name: "Pearl Drop Earrings", price: 899, mrp: 1299, description: "Elegant pearl drop earrings with gold finish.", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800", category: "fancy", subcategory: "Earrings" },
    { id: "f2", name: "Royal Gold Bangle Set", price: 1499, mrp: 2199, description: "Classic gold-plated ethnic bangles.", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800", category: "fancy", subcategory: "Bangles" },
    { id: "f3", name: "Maharani Kundan Necklace", price: 3499, mrp: 4999, description: "Luxurious kundan necklace with gold detailing.", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800", category: "fancy", subcategory: "Necklaces" },
    { id: "f4", name: "Crystal Bloom Hair Clip", price: 549, mrp: 799, description: "Delicate floral hair clip for special occasions.", image: "https://images.unsplash.com/photo-1576185055363-22003c4fc074?q=80&w=800", category: "fancy", subcategory: "Hair Accessories" },
    { id: "c1", name: "Velvet Matte Lipstick", price: 499, mrp: 799, description: "Long-lasting deep burgundy matte lipstick.", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800", category: "cosmetics", subcategory: "Lips" },
    { id: "c2", name: "Luxury Oud Perfume", price: 2499, mrp: 3999, description: "Exotic oud fragrance with floral notes.", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800", category: "cosmetics", subcategory: "Fragrance" },
    { id: "c3", name: "Gilded Eyeshadow Palette", price: 1899, mrp: 2999, description: "12-shade palette with deep golds and burgundies.", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800", category: "cosmetics", subcategory: "Eyes" },
    { id: "c4", name: "Silk Skin Night Cream", price: 1299, mrp: 1799, description: "Intense hydration night cream for glowing skin.", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800", category: "cosmetics", subcategory: "Skincare" },
];

export const MOCK_ORDERS: Order[] = [
    { id: "ORD-2001", userId: "u1", products: [{ name: "Pearl Drop Earrings", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200", price: 899, qty: 1, category: "fancy" }, { name: "Velvet Matte Lipstick", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=200", price: 499, qty: 2, category: "cosmetics" }], total: 1897, status: "Delivered", date: "2026-04-22", address: "12 MG Road, Bengaluru, Karnataka 560001" },
    { id: "ORD-2002", userId: "u1", products: [{ name: "Royal Gold Bangle Set", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200", price: 1499, qty: 1, category: "fancy" }], total: 1499, status: "Shipped", date: "2026-05-01", address: "12 MG Road, Bengaluru, Karnataka 560001" },
    { id: "ORD-2003", userId: "u1", products: [{ name: "Luxury Oud Perfume", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200", price: 2499, qty: 1, category: "cosmetics" }], total: 2499, status: "Processing", date: "2026-05-04", address: "12 MG Road, Bengaluru, Karnataka 560001" },
    { id: "ORD-2004", userId: "u2", products: [{ name: "Maharani Kundan Necklace", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200", price: 3499, qty: 1, category: "fancy" }], total: 3499, status: "Delivered", date: "2026-04-18", address: "5 Park Street, Kolkata, WB 700016" },
    { id: "ORD-2005", userId: "u3", products: [{ name: "Gilded Eyeshadow Palette", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=200", price: 1899, qty: 1, category: "cosmetics" }, { name: "Silk Skin Night Cream", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200", price: 1299, qty: 1, category: "cosmetics" }], total: 3198, status: "Processing", date: "2026-05-05", address: "88 Juhu Beach Rd, Mumbai, MH 400049" },
    { id: "ORD-2006", userId: "u4", products: [{ name: "Crystal Bloom Hair Clip", image: "https://images.unsplash.com/photo-1576185055363-22003c4fc074?q=80&w=200", price: 549, qty: 2, category: "fancy" }], total: 1098, status: "Cancelled", date: "2026-04-30", address: "22 Anna Salai, Chennai, TN 600002" },
    { id: "ORD-2007", userId: "u2", products: [{ name: "Velvet Matte Lipstick", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=200", price: 499, qty: 3, category: "cosmetics" }], total: 1497, status: "Shipped", date: "2026-05-03", address: "5 Park Street, Kolkata, WB 700016" },
    { id: "ORD-2008", userId: "u5", products: [{ name: "Royal Gold Bangle Set", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200", price: 1499, qty: 1, category: "fancy" }, { name: "Pearl Drop Earrings", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200", price: 899, qty: 1, category: "fancy" }], total: 2398, status: "Delivered", date: "2026-04-25", address: "7 Civil Lines, Delhi 110054" },
];

export const MOCK_CUSTOMERS = [
    { id: "u1", name: "Priya Sharma", email: "priya@example.com", phone: "+91 9876543210", orders: 3, totalSpent: 5895, joinDate: "2025-12-01", avatar: "PS" },
    { id: "u2", name: "Anita Reddy", email: "anita@example.com", phone: "+91 9123456780", orders: 2, totalSpent: 4996, joinDate: "2026-01-15", avatar: "AR" },
    { id: "u3", name: "Meena Iyer", email: "meena@example.com", phone: "+91 9988776655", orders: 1, totalSpent: 3198, joinDate: "2026-02-20", avatar: "MI" },
    { id: "u4", name: "Kavya Nair", email: "kavya@example.com", phone: "+91 8877665544", orders: 1, totalSpent: 1098, joinDate: "2026-03-10", avatar: "KN" },
    { id: "u5", name: "Deepa Kulkarni", email: "deepa@example.com", phone: "+91 7766554433", orders: 1, totalSpent: 2398, joinDate: "2026-04-01", avatar: "DK" },
];