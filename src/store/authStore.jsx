// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Simpan token dan set authenticated berdasar token
      setToken: (token) => {
        set({ token, isAuthenticated: !!token });
      },

      // Action untuk menyimpan data user dan set authenticated
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      // Action untuk logout
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      // Dipanggil setelah rehydrate untuk sinkronkan isAuthenticated
      rehydrateAuth: () => {
        const token = get().token;
        set({ isAuthenticated: !!token });
      },

      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        // setelah storage ter-rehydrate
        state?.rehydrateAuth?.();
        state?.setHasHydrated?.(true);
      },
    }
  )
);
