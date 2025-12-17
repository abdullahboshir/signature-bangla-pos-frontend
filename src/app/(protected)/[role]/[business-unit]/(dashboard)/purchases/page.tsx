"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, Clock, MoreHorizontal, Edit, Trash } from "lucide-react";
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
import { PurchaseItemsField } from "./_components/PurchaseItemsField";

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  received: "bg-green-500/10 text-green-500 border-green-500/20",
  ordered: "bg-blue-500/10 text-blue-500 border-blue-500/20",
} as const;

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const { currentBusinessUnit } = useCurrentBusinessUnit();

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, [currentBusinessUnit]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/purchases');
      if (res.success) {
        setPurchases(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/super-admin/suppliers');
      if (res.success) {
        setSuppliers(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    }
  };

  const handleCreate = () => {
    setSelectedPurchase({
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: []
    });
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (purchase: any) => {
    setSelectedPurchase(purchase);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase?")) return;
    try {
      const res = await api.delete(`/super-admin/purchases/${id}`);
      if (res.success) {
        toast.success("Purchase deleted successfully");
        fetchPurchases();
      }
    } catch (error) {
      toast.error("Failed to delete purchase");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Adjust values if needed
      if (currentBusinessUnit) {
        values.businessUnit = currentBusinessUnit.id || currentBusinessUnit._id;
      }

      // Calculate totals if items are present
      if (values.items && Array.isArray(values.items)) {
        values.subTotal = values.items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
        values.totalAmount = values.subTotal + (values.tax || 0) - (values.discount || 0);
      }

      if (modalMode === 'create') {
        const res = await api.post('/super-admin/purchases/create', values);
        if (res.success) {
          toast.success("Purchase created successfully");
        }
      } else {
        const res = await api.patch(`/super-admin/purchases/${selectedPurchase._id}`, values);
        if (res.success) {
          toast.success("Purchase updated successfully");
        }
      }
      setIsModalOpen(false);
      fetchPurchases();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${modalMode} purchase`);
    }
  };

  const purchaseFields: FieldConfig[] = [
    {
      name: "supplier",
      label: "Supplier",
      type: "select",
      options: suppliers.map(s => ({ label: s.name, value: s._id || s.id })),
      required: true,
    },
    {
      name: "purchaseDate",
      label: "Date",
      type: "date",
      required: true,
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: "date",
    },
    {
      name: "referenceNo",
      label: "Reference No",
      type: "text",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Ordered", value: "ordered" },
        { label: "Received", value: "received" }
      ],
      defaultValue: "pending"
    },
    // Custom Items Field
    {
      name: "items",
      label: "Items",
      type: "custom", // Enhanced AutoFormModal support
      render: ({ control, name }) => <PurchaseItemsField control={control} name={name} />
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
    }
  ];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "referenceNo", // Changed from id to referenceNo for display if available, else id
      header: "Reference",
      cell: ({ row }: { row: any }) => <span className="font-semibold">{row.original.referenceNo || row.original.id}</span>,
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      cell: ({ row }: { row: any }) => {
        const s = suppliers.find(sup => sup._id === row.original.supplier || sup.id === row.original.supplier);
        return s ? s.name : "Unknown";
      },
    },
    {
      accessorKey: "purchaseDate",
      header: "Date",
      cell: ({ row }: { row: any }) => row.original.purchaseDate ? new Date(row.original.purchaseDate).toLocaleDateString() : "",
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }: { row: any }) => row.original.items?.length || 0,
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }: { row: any }) => <span className="font-semibold">৳{row.original.totalAmount?.toFixed(2)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <Badge
          variant="outline"
          className={`text-xs ${statusColors[row.original.status as keyof typeof statusColors] || ""}`}
        >
          {row.original.status}
        </Badge>
      ),
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
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredPurchases = purchases.filter(p =>
    (p.referenceNo && p.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DataPageLayout
      title="Purchases"
      description="Manage your purchase orders and inventory replenishment"
      createAction={{
        label: "New Purchase",
        onClick: handleCreate
      }}
      stats={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Purchases"
            value={purchases.length}
            icon={ShoppingBag}
          />
          <StatCard
            title="Pending Orders"
            value={purchases.filter(p => p.status === 'pending').length}
            icon={Clock}
          />
        </div>
      }
      extraFilters={
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchases..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      }
    >
      <DataTable columns={columns} data={filteredPurchases} isLoading={loading} />

      <AutoFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={modalMode === 'create' ? "New Purchase" : "Edit Purchase"}
        fields={purchaseFields}
        onSubmit={handleSubmit}
        initialValues={selectedPurchase}
        submitLabel={modalMode === 'create' ? "Create Purchase" : "Update Purchase"}
      />
    </DataPageLayout>
  );
}

