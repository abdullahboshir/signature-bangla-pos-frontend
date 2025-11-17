// components/modules/products/ProductList.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-display/tables/DataTable";
import { DataTableColumnHeader } from "@/components/data-display/tables/TableColumnHeader";
import { StatusCell } from "@/components/data-display/table-cells/StatusCell";
import { StockCell } from "@/components/data-display/table-cells/StockCell";
import { PriceCell } from "@/components/data-display/table-cells/PriceCell";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "out-of-stock";
  createdAt: string;
};

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("category")}</Badge>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <PriceCell price={row.getValue("price")} />,
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => <StockCell stock={row.getValue("stock")} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusCell status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductList({ products, isLoading }: ProductListProps) {
  const filters = [
    {
      column: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Out of Stock", value: "out-of-stock" },
      ],
    },
    {
      column: "category",
      title: "Category",
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Books", value: "books" },
      ],
    },
  ];

  return (
    <DataTable
      columns={productColumns}
      data={products}
      searchKey="name"
      searchPlaceholder="Search products..."
      filters={filters}
      isLoading={isLoading}
    />
  );
}
