import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserAuth,
  LoginCredentials,
  Role,
} from "@/modules/auth/domain/entities";
import { httpManager } from "@/lib/httpManager";

interface LoginResponse {
  access_token: string;
  roles: string[];
}

export interface AuthState {
  // State properties
  user: UserAuth | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions (effects)
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;

  // Internal state setters
  setUser: (user: UserAuth | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await httpManager.post<LoginResponse>(
            "/auth/login",
            credentials
          );

          const { access_token, roles } = response.data;

          const userAuthenticated: UserAuth = {
            email: credentials.email,
            token: access_token,
            role: (roles[0] as Role) || Role.Seller,
          };

          httpManager.setAuthToken(access_token);

          set({
            user: userAuthenticated,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          // Try to call logout endpoint, but don't fail if it errors
          try {
            await httpManager.post("/auth/logout");
          } catch {
            console.warn(
              "Logout API call failed, but continuing with local logout"
            );
          }

          // Remove token from httpManager
          httpManager.removeAuthToken();

          // Clear any persisted auth data
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth-store");
          }

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Logout failed";
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            isAuthenticated: false,
          });
        }
      },

      initializeAuth: async () => {
        try {
          set({ isLoading: true, error: null });

          const token = get().user?.token;
          if (!token) {
            set({ isLoading: false });
            return;
          }

          // Set the token in httpManager for subsequent requests
          httpManager.setAuthToken(token);

          // Try to validate the token by making a request to a protected endpoint
          try {
            const response = await httpManager.get("/products");
            if (response.data) {
              // Token is valid, user data is already in the store
              set({
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // Token is invalid, clear everything
              httpManager.removeAuthToken();
              if (typeof window !== "undefined") {
                localStorage.removeItem("auth-store");
              }
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } catch {
            // Token validation failed, clear everything
            httpManager.removeAuthToken();
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth-store");
            }
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Don't show error for initialization
          });
        }
      },

      clearError: () => set({ error: null }),

      // Internal setters (for direct state updates if needed)
      setUser: (user: UserAuth | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data, not loading states or errors
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Merge the persisted state with initial state
      onRehydrateStorage: () => (state) => {
        // Initialize auth on app start
        if (state) {
          state.initializeAuth();
        }
      },
    }
  )
);

// Computed selectors (can be used for memoized values)
export const useAuthSelectors = () => {
  const store = useAuthStore();

  return {
    isAdmin: store.user?.role === "Admin",
    isSeller: store.user?.role === "Seller",
    userEmail: store.user?.email,
  };
};

// Initialize auth store integration
export const initializeAuthStore = () => {
  // Set up token synchronization with httpManager
  useAuthStore.subscribe((state, prevState) => {
    if (state.user?.token !== prevState.user?.token) {
      if (state.user?.token) {
        httpManager.setAuthToken(state.user.token);
      } else {
        httpManager.removeAuthToken();
      }
    }
  });

  // Initialize with current state
  const currentState = useAuthStore.getState();
  if (currentState.user?.token) {
    httpManager.setAuthToken(currentState.user.token);
  }
};
