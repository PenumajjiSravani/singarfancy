import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserSession {
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

interface AuthState {
  user: UserSession | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email, name) => {
        const role = email.startsWith("admin") ? "ADMIN" : "CUSTOMER";
        set({
          user: {
            name: name || (role === "ADMIN" ? "Grand Curator" : "Valued Client"),
            email,
            role,
          },
        });
      },
      logout: () => {
        set({ user: null });
      },
      isAuthenticated: () => {
        return get().user !== null;
      },
      isAdmin: () => {
        return get().user?.role === "ADMIN";
      },
    }),
    {
      name: "singar-auth", // Persisted in local storage
    }
  )
);
