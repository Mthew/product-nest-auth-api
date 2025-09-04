"use client";

import { Sprout } from "lucide-react";

interface ProductManagementHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function ProductManagementHeader({
  title = "Product Inventory",
  subtitle = "Agricultural Store Management",
  description = "Manage your agricultural products and supplies",
}: ProductManagementHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-[#2d7e06] rounded-lg">
          <Sprout className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Croper</h1>
          <p className="text-sm text-[#2d7e06] font-medium">{subtitle}</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
