"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPreviousNext?: boolean;
  siblingCount?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext = true,
  siblingCount = 1,
}: PaginationProps) => {
  // Helper function to generate page numbers
  const getPageNumbers = () => {
    const totalNumbers = siblingCount + 5; // Prev + 1 + current + 1 + Next
    const totalBlocks = totalNumbers + 2; // Add 2 for left and right ellipsis

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount);
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

      let pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      );

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = Array.from(
            { length: spillOffset },
            (_, index) => startPage - spillOffset + index
          );
          pages = [...extraPages, ...pages];
          break;
        }

        case !hasLeftSpill && hasRightSpill: {
          const extraPages = Array.from(
            { length: spillOffset },
            (_, index) => endPage + index + 1
          );
          pages = [...pages, ...extraPages];
          break;
        }

        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [currentPage];
          break;
        }
      }

      return {
        pages,
        hasLeftSpill,
        hasRightSpill,
      };
    }

    return {
      pages: Array.from({ length: totalPages }, (_, index) => index + 1),
      hasLeftSpill: false,
      hasRightSpill: false,
    };
  };

  const { pages, hasLeftSpill, hasRightSpill } = getPageNumbers();

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      {showPreviousNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Left Ellipsis */}
      {hasLeftSpill && (
        <div className="h-8 w-8 flex items-center justify-center">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(page)}
          className={`h-8 w-8 p-0 ${
            currentPage === page ? "bg-green-600 hover:bg-green-700" : ""
          }`}
        >
          {page}
        </Button>
      ))}

      {/* Right Ellipsis */}
      {hasRightSpill && (
        <div className="h-8 w-8 flex items-center justify-center">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Last Page */}
      {totalPages > 1 && !pages.includes(totalPages) && (
        <Button
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(totalPages)}
          className={`h-8 w-8 p-0 ${
            currentPage === totalPages ? "bg-green-600 hover:bg-green-700" : ""
          }`}
        >
          {totalPages}
        </Button>
      )}

      {/* Next Button */}
      {showPreviousNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Pagination;
