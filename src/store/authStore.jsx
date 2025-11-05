// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Action untuk login - hanya simpan token, belum authenticated
      setToken: (token) => {
        set({ token });
      },

      // Action untuk menyimpan data user dan set authenticated
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      // Action untuk logout
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
