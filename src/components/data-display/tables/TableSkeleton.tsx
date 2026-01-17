// components/data-display/tables/TableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  columns: number
  rows?: number
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="flex space-x-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
