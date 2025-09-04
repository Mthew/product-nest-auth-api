import { ReactNode } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Role } from "../../../modules/auth/domain/entities/role.enum";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: Role;
  fallback?: ReactNode;
}

export const AuthGuard = ({
  children,
  requireAuth = true,
  requiredRole,
  fallback,
}: AuthGuardProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return fallback || <div>Checking authentication...</div>;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback || <div>Please log in to access this content.</div>;
  }

  // If specific role is required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      fallback || <div>You do not have permission to access this content.</div>
    );
  }

  // If authentication is not required, or user meets requirements
  return <>{children}</>;
};

// Convenience components for specific roles
export const AdminGuard = ({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => (
  <AuthGuard requiredRole={Role.Admin} fallback={fallback}>
    {children}
  </AuthGuard>
);

export const SellerGuard = ({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => (
  <AuthGuard requiredRole={Role.Seller} fallback={fallback}>
    {children}
  </AuthGuard>
);
