// components/data-display/table-cells/StockCell.tsx
import { cn } from "@/lib/utils"

interface StockCellProps {
  stock: number
  lowStockThreshold?: number
}

export function StockCell({ stock, lowStockThreshold = 10 }: StockCellProps) {
  const isLowStock = stock <= lowStockThreshold
  const isOutOfStock = stock === 0

  return (
    <span
      className={cn(
        "font-medium",
        isOutOfStock && "text-red-500",
        isLowStock && !isOutOfStock && "text-orange-500"
      )}
    >
      {stock}
    </span>
  )
}
