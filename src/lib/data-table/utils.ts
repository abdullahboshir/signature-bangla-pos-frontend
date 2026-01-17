// ============================================================================
// FILE: src/lib/data-table/utils.ts
// ============================================================================

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { TableColumn } from "@/types/data-table";
import { AvatarCell } from "@/components/data-display/table-cells/AvatarCell";
import { StatusCell } from "@/components/data-display/table-cells/StatusCell";
import { DateCell } from "@/components/data-display/table-cells/DateCell";
import { BooleanCell } from "@/components/data-display/table-cells/BooleanCell";
import { PriceCell } from "@/components/data-display/table-cells/PriceCell";
import { ActionCell } from "@/components/data-display/table-cells/ActionCell";
import { StockCell } from "@/components/data-display/table-cells/StockCell";

/**
 * Safely read nested values like "category.name" from an object
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc: any, key: string) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[key];
  }, obj);
}

/**
 * Generate TanStack React Table column definitions from config
 * 
 * @param config - Column configuration
 * @param actions - Action handlers (onEdit, onDelete, onView, onCopy)
 * @returns Array of ColumnDef for TanStack Table
 */
export function generateColumns<T extends Record<string, any>>(
  config: { columns: TableColumn[] },
  actions?: {
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    onCopy?: (item: T) => void;
  }
): ColumnDef<T>[] {
  return config.columns.map((column: TableColumn) => {
    const hasNestedAccessor = column.accessorKey.includes(".");

    const columnDef: ColumnDef<T> = {
      id: column.id,
      // For flat fields let TanStack handle accessorKey directly.
      // For nested paths we provide an accessorFn instead.
      accessorKey: hasNestedAccessor ? undefined : column.accessorKey,
      accessorFn: hasNestedAccessor
        ? (row: T) => getNestedValue(row, column.accessorKey)
        : undefined,
      header: column.header,
      cell: ({ row }) => {
        // Always read by column id so it works with accessorFn as well.
        const value = row.getValue(column.id);
        const rowData = row.original;

        // ====== RENDER CELL BASED ON TYPE ======
        switch (column.type) {
          case "image":
            // Avatar or image cell
            if (
              column.accessorKey === "avatar" ||
              column.accessorKey === "image"
            ) {
              return React.createElement(AvatarCell, {
                  src: value as string,
                  fallback: (rowData as any)["name"] || (rowData as any)["username"] || "N/A",
                });
            }

            // Generic image
            if (value) {
              return React.createElement("img", {
                src: value as string,
                alt: String(column.header),
                className: "h-10 w-10 rounded-md object-cover",
              });
            } else {
              return "-";
            }

          case "status":
            return React.createElement(StatusCell, { status: value as string });

          case "date":
            return React.createElement(DateCell, { date: (value as unknown) as string | Date });

          case "boolean":
            return React.createElement(BooleanCell, { value: value as boolean });

          case "number":
            // Check if it's price/amount
            if (
              column.accessorKey?.includes("price") ||
              column.accessorKey?.includes("amount") ||
              column.accessorKey?.includes("total")
            ) {
              return React.createElement(PriceCell, { price: value as number });
            }

            // Check if it's stock quantity
            if (
              column.accessorKey?.includes("stock") ||
              column.accessorKey?.includes("quantity")
            ) {
              return React.createElement(StockCell, { stock: value as number });
            }

            // Default number formatting
            return (
              (typeof value === "number" ? value.toLocaleString() : value) ||
              "0"
            );

          case "actions":
            return React.createElement(ActionCell as any, {
                item: rowData as any,
                onEdit: actions?.onEdit as any,
                onDelete: actions?.onDelete as any,
                onView: actions?.onView as any,
                showDropdown: false,
              });

          default:
            // Handle null/undefined/empty values
            if (value === null || value === undefined || value === "") {
              return React.createElement("span", { className: "text-muted-foreground" }, "-");
            }

            // Convert to string
            return (
              (typeof value === "string"
                ? value
                : typeof value === "number"
                  ? value.toLocaleString()
                  : String(value)) || "-"
            );
        }
      },
    };

    // ====== APPLY COLUMN PROPERTIES ======
    if (column.width) {
      columnDef.size = column.width;
    }

    if (column.filter !== false) {
      columnDef.enableColumnFilter = true;
    }

    if (column.sortable !== false) {
      columnDef.enableSorting = true;
    }

    // Add metadata for filtering/sorting
    columnDef.meta = {
      type: column.type,
      filterVariant:
        column.type === "boolean" ? "checkbox" : "text",
    };

    return columnDef;
  });
}

/**
 * Export table data to CSV file
 * 
 * @param data - Array of data to export
 * @param columns - Column configuration
 * @param filename - Base filename (date will be appended)
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: TableColumn[],
  filename: string
): void {
  try {
    // Filter out non-exportable columns
    const exportableColumns = columns.filter(
      (col) => col.type !== "actions" && col.type !== "image"
    );

    // Prepare CSV headers
    const headers = exportableColumns
      .map((col) => `"${col.header.replace(/"/g, '""')}"`)
      .join(",");

    // Prepare CSV rows
    const rows = data
      .map((row) =>
        exportableColumns
          .map((col) => {
            let value = row[col.accessorKey as keyof T];

            // Format based on column type
            if (col.type === "date" && value) {
              value = new Date(value as string | Date).toLocaleDateString() as any;
            }

            if (col.type === "boolean" && value !== undefined) {
              value = (value ? "Yes" : "No") as any;
            }

            if (col.type === "number" && typeof value === "number") {
              value = value.toLocaleString() as any;
            }

            // Escape quotes and wrap in quotes
            const stringValue = value?.toString() || "";
            return `"${stringValue.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    // Create CSV content
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    // Create download link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw new Error("Failed to export CSV");
  }
}

/**
 * Get filter options for a data type
 * 
 * @param dataType - Type of data (user, product, order, etc.)
 * @returns Array of filter options
 */
export function getFilterOptions(
  dataType: string
): Array<{
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}> {
  const options: Record<
    string,
    Array<{ value: string; label: string; count?: number }>
  > = {
    user: [
      { value: "active", label: "Active", count: 0 },
      { value: "inactive", label: "Inactive", count: 0 },
      { value: "suspended", label: "Suspended", count: 0 },
      { value: "admin", label: "Admin", count: 0 },
      { value: "manager", label: "Manager", count: 0 },
      { value: "staff", label: "Staff", count: 0 },
      { value: "customer", label: "Customer", count: 0 },
    ],
    product: [
      { value: "in-stock", label: "In Stock", count: 0 },
      { value: "low-stock", label: "Low Stock", count: 0 },
      { value: "out-of-stock", label: "Out of Stock", count: 0 },
      { value: "active", label: "Active", count: 0 },
      { value: "inactive", label: "Inactive", count: 0 },
      { value: "draft", label: "Draft", count: 0 },
    ],
    order: [
      { value: "pending", label: "Pending", count: 0 },
      { value: "processing", label: "Processing", count: 0 },
      { value: "shipped", label: "Shipped", count: 0 },
      { value: "delivered", label: "Delivered", count: 0 },
      { value: "cancelled", label: "Cancelled", count: 0 },
      { value: "refunded", label: "Refunded", count: 0 },
    ],
    customer: [
      { value: "active", label: "Active", count: 0 },
      { value: "inactive", label: "Inactive", count: 0 },
      { value: "vip", label: "VIP", count: 0 },
      { value: "regular", label: "Regular", count: 0 },
      { value: "new", label: "New", count: 0 },
    ],
    category: [
      { value: "active", label: "Active", count: 0 },
      { value: "inactive", label: "Inactive", count: 0 },
      { value: "has-parent", label: "Has Parent", count: 0 },
      { value: "no-parent", label: "No Parent", count: 0 },
    ],
  };

  return options[dataType] || [];
}

/**
 * Extract filterable columns from configuration
 * 
 * @param columns - Array of column configs
 * @returns Array of filterable columns
 */
export function getFilterableColumns(
  columns: TableColumn[]
): TableColumn[] {
  return columns.filter(
    (col) =>
      col.filter !== false &&
      col.type !== "actions" &&
      col.type !== "image"
  );
}

/**
 * Extract sortable columns from configuration
 * 
 * @param columns - Array of column configs
 * @returns Array of sortable columns
 */
export function getSortableColumns(
  columns: TableColumn[]
): TableColumn[] {
  return columns.filter((col) => col.sortable !== false);
}

/**
 * Format cell value based on type
 * 
 * @param value - Value to format
 * @param type - Column type (date, boolean, number, price, etc.)
 * @returns Formatted string value
 */
export function formatCellValue(
  value: any,
  type?: string
): string {
  // Handle null/undefined/empty values
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (type) {
    case "date":
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return String(value);
      }

    case "boolean":
      return value ? "Yes" : "No";

    case "number":
      try {
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);
      } catch {
        return String(value);
      }

    case "price":
    case "amount":
      try {
        return `৳${
          typeof value === "number"
            ? value.toLocaleString()
            : String(value)
        }`;
      } catch {
        return String(value);
      }

    default:
      return String(value);
  }
}

/**
 * Get display name for filter option
 * 
 * @param value - Filter value
 * @param dataType - Type of data being filtered
 * @returns Display label for the filter value
 */
export function getFilterLabel(
  value: string,
  dataType: string
): string {
  const options = getFilterOptions(dataType);
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

/**
 * Check if a value matches filter criteria
 * 
 * @param value - Value to check
 * @param filter - Filter value
 * @param type - Column type
 * @returns true if value matches filter
 */
export function matchesFilter(
  value: any,
  filter: string,
  type?: string
): boolean {
  if (!filter) return true;

  const normalizedValue = String(value).toLowerCase();
  const normalizedFilter = filter.toLowerCase();

  switch (type) {
    case "boolean":
      return (
        (value === true && filter === "true") ||
        (value === false && filter === "false")
      );

    case "status":
      return normalizedValue.includes(normalizedFilter);

    default:
      return normalizedValue.includes(normalizedFilter);
  }
}
