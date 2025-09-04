import { useEffect } from "react";
import {
  useAuthStore,
  useAuthSelectors,
  initializeAuthStore,
} from "../stores/auth";
import { LoginCredentials } from "@/modules/auth/domain/entities";

export const useAuth = () => {
  const authStore = useAuthStore();
  const selectors = useAuthSelectors();

  // Initialize auth store integration and auth on mount
  useEffect(() => {
    initializeAuthStore();
    // authStore.initializeAuth();
  }, [authStore]);

  return {
    // State
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,

    // Computed values
    isAdmin: selectors.isAdmin,
    isSeller: selectors.isSeller,
    userEmail: selectors.userEmail,
    userId: selectors.userEmail, // Use email as userId for now since UserAuth doesn't have id

    // Actions
    login: authStore.login,
    logout: authStore.logout,
    clearError: authStore.clearError,

    // Utility functions
    loginWithCredentials: async (email: string, password: string) => {
      const credentials: LoginCredentials = { email, password };
      return authStore.login(credentials);
    },
  };
};
