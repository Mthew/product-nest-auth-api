"use client";

import type React from "react";
import LoginForm from "@/components/features/auth/login-form";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/features/auth/auth-guard";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    redirect("/home");
  }

  return (
    <AuthGuard requireAuth={false} fallback={<div>Loading...</div>}>
      <LoginForm />
    </AuthGuard>
  );
}
