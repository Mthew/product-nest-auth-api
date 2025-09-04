import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";

import { Product } from "@/modules/product/domain";

interface ProductCardProps {
  product: Product;
  openEditDialog: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

export const ProductCard = ({
  product,
  openEditDialog,
  deleteProduct,
}: ProductCardProps) => {
  return (
    <Card
      key={product.id}
      className="flex flex-col hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight text-balance">
            {product.name}
          </CardTitle>
          <Badge
            variant="secondary"
            className="shrink-0 text-xs bg-[#2d7e06]/10 text-[#2d7e06] border-[#2d7e06]/20"
          >
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="flex-1 text-sm leading-relaxed mb-4 text-pretty">
          {product.description}
        </CardDescription>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#2d7e06]">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditDialog(product)}
              className="hover:bg-[#2d7e06]/5"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit product</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => deleteProduct(product.id)}
              className="hover:bg-destructive/5"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete product</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
