"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Package, AlertTriangle, Search, MoreHorizontal, Edit } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { FieldConfig } from "@/types/auto-form";
import { axiosInstance as api } from "@/lib/axios/axiosInstance";
import { toast } from "sonner";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { currentBusinessUnit } = useCurrentBusinessUnit();

  useEffect(() => {
    fetchInventory();
  }, [currentBusinessUnit]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/products');
      if (res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStock = (item: any) => {
    // Prepare initial values. Ensure nested objects exist.
    // If API returns flat structure or different, adjust here.
    // Assuming product has { inventory: { stock: number, lowStockThreshold: number } }
    setSelectedItem({
      id: item._id || item.id,
      "inventory.stock": item.inventory?.stock || 0,
      "inventory.lowStockThreshold": item.inventory?.lowStockThreshold || 10
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Values will come as { "inventory.stock": ..., ... } due to how AutoForm works with flat keys in simpler setup,
      // BUT react-hook-form interprets dots as nested objects. 
      // So 'values' might be { inventory: { stock: ... } } OR { "inventory.stock": ... } depending on how inputs are registered.
      // AutoFormModal uses `field.name` in `register`.
      // RHF treats "a.b" as nested.
      // So values should be { inventory: { stock: ... } }.
      // Let's verify and construct payload.

      const payload = {
        inventory: {
          stock: values.inventory?.stock,
          lowStockThreshold: values.inventory?.lowStockThreshold
        }
      };

      // We need to merge with existing data or just send partial update?
      // Usually partial update is safer.
      // The API patch endpoint: /super-admin/products/:id

      const res = await api.patch(`/super-admin/products/${selectedItem.id}`, payload);
      if (res.success) {
        toast.success("Inventory updated successfully");
        fetchInventory();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update inventory");
    }
  };

  const inventoryFields: FieldConfig[] = [
    {
      name: "inventory.stock" as any, // Type cast for nested path if stricter types used
      label: "Current Stock",
      type: "number",
      required: true,
    },
    {
      name: "inventory.lowStockThreshold" as any,
      label: "Low Stock Threshold",
      type: "number",
      required: true,
    }
  ];

  // Define Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.sku || "No SKU"}</span>
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock Level",
      cell: ({ row }: { row: any }) => {
        const stock = row.original.inventory?.stock || 0;
        // Capacity isn't standard. Let's assume max is stock * 2 or just 100 for viz if small?
        // Better: just show number and progress bar relative to *something* or just a bar if low.
        // Let's us lowStockThreshold as the 'warning' marker.
        const threshold = row.original.inventory?.lowStockThreshold || 10;
        const status = stock === 0 ? 'critical' : stock <= threshold ? 'low' : 'good';
        const max = Math.max(stock + 20, 100); // Dynamic max for viz

        return (
          <div className="w-[180px] space-y-1">
            <div className="flex justify-between text-xs">
              <span>{stock} units</span>
              <span className={status === 'good' ? 'text-green-500' : 'text-orange-500'}>
                {status === 'critical' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock'}
              </span>
            </div>
            <Progress value={(stock / max) * 100} className="h-2" />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEditStock(row.original)}>
              <Edit className="mr-2 h-4 w-4" /> Adjust Stock
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredItems = products.filter(item =>
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const lowStockCount = products.filter(i => (i.inventory?.stock || 0) <= (i.inventory?.lowStockThreshold || 10)).length;

  return (
    <DataPageLayout
      title="Inventory Management"
      description="Monitor stock levels and manage warehouse operations."
      stats={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Items"
            value={products.length}
            icon={Package}
          />
          <StatCard
            title="Low Stock"
            value={lowStockCount}
            icon={AlertTriangle}
            trend={lowStockCount > 0 ? "destructive" : "neutral"}
          />
        </div>
      }
      extraFilters={
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      }
    >
      <DataTable columns={columns} data={filteredItems} isLoading={loading} />

      <AutoFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Adjust Stock"
        description="Update inventory levels manually. For purchases/sales, use the respective modules."
        fields={inventoryFields}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
        submitLabel="Update Inventory"
      />
    </DataPageLayout>
  );
}
