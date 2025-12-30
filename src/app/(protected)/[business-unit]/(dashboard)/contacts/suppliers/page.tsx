// app/(protected)/[business-unit]/[role]/(dashboard)/contacts/suppliers/page.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Truck, Plus, Search, Phone, Mail, MapPin, MoreHorizontal, CheckCircle } from "lucide-react";
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

// Mock suppliers data
const suppliers = [
  {
    id: "1",
    name: "Tech Supplier Inc.",
    contact: "John Smith",
    email: "john@techsupplier.com",
    phone: "+880 1234 567890",
    address: "Dhaka, Bangladesh",
    status: "active",
    totalOrders: 45,
  },
  {
    id: "2",
    name: "Fashion Wholesale",
    contact: "Jane Doe",
    email: "jane@fashionwholesale.com",
    phone: "+880 9876 543210",
    address: "Chittagong, Bangladesh",
    status: "active",
    totalOrders: 32,
  },
  {
    id: "3",
    name: "Electronics Direct",
    contact: "Bob Johnson",
    email: "bob@electronicsdirect.com",
    phone: "+880 5555 123456",
    address: "Sylhet, Bangladesh",
    status: "inactive",
    totalOrders: 18,
  },
]

export default function SuppliersPage() {
  // Define Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: any }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "contact",
      header: "Contact Person",
      cell: ({ row }: { row: any }) => row.original.contact,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span>{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "totalOrders",
      header: "Total Orders",
      cell: ({ row }: { row: any }) => row.original.totalOrders,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DataPageLayout
      title="Suppliers"
      description="Manage your supplier contacts and information"
      createAction={{
        label: "Add Supplier",
        onClick: () => console.log("Add Supplier")
      }}
      stats={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Suppliers"
            value={suppliers.length}
            icon={Truck}
          />
          <StatCard
            title="Active Suppliers"
            value={suppliers.filter(s => s.status === 'active').length}
            icon={CheckCircle}
          />
        </div>
      }
      extraFilters={
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      }
    >
      <DataTable columns={columns} data={filteredSuppliers} />
    </DataPageLayout>
  );
}

