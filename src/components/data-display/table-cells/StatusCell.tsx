// components/data-display/table-cells/StatusCell.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusCellProps {
  status: string
  statusMap?: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }>
}

type DefaultStatusMap = {
  [key: string]: {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
};

export function StatusCell({ status, statusMap }: StatusCellProps) {
  const defaultStatusMap: DefaultStatusMap = {
    active: { variant: "default" as const, label: "Active" },
    inactive: { variant: "secondary" as const, label: "Inactive" },
    pending: { variant: "outline" as const, label: "Pending" },
    "out-of-stock": { variant: "destructive" as const, label: "Out of Stock" },
  }

  const statusConfig = (statusMap || defaultStatusMap)[status] || { variant: "outline" as const, label: status }

  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  )
}
