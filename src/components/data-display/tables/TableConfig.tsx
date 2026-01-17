import { TableConfig as ITableConfig, DataType } from '@/types/data-table';
import { User, Package, Folder, ShoppingCart, Users, Truck, Layers, FileText, Shield, Key, Store } from 'lucide-react';

export const TableConfig: Record<DataType, ITableConfig> = {
  user: {
    dataType: 'user',
    columns: [
      { id: 'avatar', header: '', accessorKey: 'image', type: 'image', width: 50 },
      { id: 'name', header: 'Name', accessorKey: 'name', sortable: true, filter: true },
      { id: 'email', header: 'Email', accessorKey: 'email', sortable: true, filter: true },
      { id: 'role', header: 'Role', accessorKey: 'role', type: 'status', sortable: true, filter: true },
      { id: 'status', header: 'Status', accessorKey: 'isActive', type: 'boolean', sortable: true, filter: true },
      { id: 'createdAt', header: 'Joined', accessorKey: 'createdAt', type: 'date', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 120 },
    ],
    defaultSort: { id: 'createdAt', desc: true },
    pageSize: 10,
    showToolbar: true,
    showPagination: true,
    enableSelection: true,
    enableFilters: true,
    actions: {
      create: true,
      edit: true,
      delete: true,
      view: true,
      export: true,
    },
    toolbar: {
      placeholder: 'Search users...',
    },
  },

  product: {
    dataType: 'product',
    columns: [
      { id: 'image', header: '', accessorKey: 'image', type: 'image', width: 60 },
      { id: 'name', header: 'Product', accessorKey: 'name', sortable: true, filter: true },
      { id: 'sku', header: 'SKU', accessorKey: 'sku', sortable: true, filter: true },
      { id: 'category', header: 'Category', accessorKey: 'category.name', sortable: true, filter: true },
      { id: 'price', header: 'Price', accessorKey: 'price', type: 'number', sortable: true },
      { id: 'stock', header: 'Stock', accessorKey: 'stock', type: 'number', sortable: true },
      { id: 'status', header: 'Status', accessorKey: 'status', type: 'status', sortable: true, filter: true },
      { id: 'createdAt', header: 'Added', accessorKey: 'createdAt', type: 'date', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 120 },
    ],
    defaultSort: { id: 'createdAt', desc: true },
    pageSize: 10,
    showToolbar: true,
    actions: {
      create: true,
      edit: true,
      delete: true,
      view: true,
      export: true,
    },
  },

  category: {
    dataType: 'category',
    columns: [
      { id: 'icon', header: '', accessorKey: 'icon', type: 'image', width: 50 },
      { id: 'name', header: 'Name', accessorKey: 'name', sortable: true, filter: true },
      { id: 'description', header: 'Description', accessorKey: 'description', sortable: true },
      { id: 'parent', header: 'Parent', accessorKey: 'parent.name', sortable: true, filter: true },
      { id: 'productCount', header: 'Products', accessorKey: 'productCount', type: 'number', sortable: true },
      { id: 'status', header: 'Status', accessorKey: 'isActive', type: 'boolean', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 100 },
    ],
    defaultSort: { id: 'name', desc: false },
    pageSize: 15,
  },

  customer: {
    dataType: 'customer',
    columns: [
      { id: 'name', header: 'Name', accessorKey: 'name', sortable: true, filter: true },
      { id: 'email', header: 'Email', accessorKey: 'email', sortable: true, filter: true },
      { id: 'phone', header: 'Phone', accessorKey: 'phone', sortable: true },
      { id: 'orders', header: 'Orders', accessorKey: 'orderCount', type: 'number', sortable: true },
      { id: 'totalSpent', header: 'Total Spent', accessorKey: 'totalSpent', type: 'number', sortable: true },
      { id: 'joined', header: 'Joined', accessorKey: 'createdAt', type: 'date', sortable: true },
      { id: 'status', header: 'Status', accessorKey: 'status', type: 'status', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 100 },
    ],
  },

  order: {
    dataType: 'order',
    columns: [
      { id: 'orderId', header: 'Order ID', accessorKey: 'orderId', sortable: true },
      { id: 'customer', header: 'Customer', accessorKey: 'customer.name', sortable: true, filter: true },
      { id: 'date', header: 'Date', accessorKey: 'createdAt', type: 'date', sortable: true },
      { id: 'amount', header: 'Amount', accessorKey: 'totalAmount', type: 'number', sortable: true },
      { id: 'status', header: 'Status', accessorKey: 'status', type: 'status', sortable: true, filter: true },
      { id: 'payment', header: 'Payment', accessorKey: 'paymentMethod', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 100 },
    ],
  },

  role: {
    dataType: 'role',
    columns: [
      { id: 'name', header: 'Role Name', accessorKey: 'name', sortable: true, filter: true },
      { id: 'description', header: 'Description', accessorKey: 'description', sortable: true },
      { id: 'usersCount', header: 'Users', accessorKey: 'usersCount', type: 'number', sortable: true },
      { id: 'createdAt', header: 'Created', accessorKey: 'createdAt', type: 'date', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 100 },
    ],
    showToolbar: true,
    actions: {
      create: true,
      edit: true,
      delete: true,
      view: true,
    },
  },

  permission: {
    dataType: 'permission',
    columns: [
      { id: 'name', header: 'Permission Name', accessorKey: 'name', sortable: true, filter: true },
      { id: 'module', header: 'Module', accessorKey: 'module', sortable: true, filter: true },
      { id: 'description', header: 'Description', accessorKey: 'description', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 100 },
    ],
    showToolbar: true,
    actions: {
      create: true,
      edit: true,
      delete: true,
    },
  },

  outlet: {
    dataType: 'outlet',
    columns: [
      { id: 'name', header: 'Name', accessorKey: 'name', sortable: true, filter: true },
      { id: 'code', header: 'Code', accessorKey: 'code', sortable: true, filter: true },
      { id: 'city', header: 'City', accessorKey: 'city', sortable: true, filter: true },
      { id: 'phone', header: 'Phone', accessorKey: 'phone', sortable: true },
      { id: 'status', header: 'Status', accessorKey: 'isActive', type: 'boolean', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions', width: 100 },
    ],
    showToolbar: true,
    actions: {
      create: true,
      edit: true,
      delete: true,
      view: true,
    },
  },

  supplier: {
    dataType: 'supplier',
    columns: [
      { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
      { id: 'contact', header: 'Contact', accessorKey: 'contactPerson', sortable: true },
      { id: 'phone', header: 'Phone', accessorKey: 'phone', sortable: true },
      { id: 'email', header: 'Email', accessorKey: 'email', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions' },
    ],
    showToolbar: true
  },

  inventory: {
    dataType: 'inventory',
    columns: [
      { id: 'product', header: 'Product', accessorKey: 'product.name', sortable: true },
      { id: 'sku', header: 'SKU', accessorKey: 'sku', sortable: true },
      { id: 'quantity', header: 'Quantity', accessorKey: 'quantity', type: 'number', sortable: true },
      { id: 'location', header: 'Location', accessorKey: 'location', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions' },
    ],
    showToolbar: true
  },

  purchase: {
    dataType: 'purchase',
    columns: [
      { id: 'id', header: 'ID', accessorKey: 'purchaseId', sortable: true },
      { id: 'supplier', header: 'Supplier', accessorKey: 'supplier.name', sortable: true },
      { id: 'date', header: 'Date', accessorKey: 'date', type: 'date', sortable: true },
      { id: 'total', header: 'Total', accessorKey: 'total', type: 'number', sortable: true },
      { id: 'status', header: 'Status', accessorKey: 'status', type: 'status', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions' },
    ],
    showToolbar: true
  },

  default: {
    dataType: 'user',
    columns: [
      { id: 'id', header: 'ID', accessorKey: 'id', sortable: true },
      { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
      { id: 'actions', header: 'Actions', accessorKey: 'actions', type: 'actions' },
    ],
    pageSize: 10,
    showToolbar: true,
    showPagination: true,
  },
};

// Icons mapping for each data type
export const DataTypeIcons: Record<DataType, React.ReactNode> = {
  user: <User className="h-4 w-4" />,
  product: <Package className="h-4 w-4" />,
  category: <Folder className="h-4 w-4" />,
  order: <ShoppingCart className="h-4 w-4" />,
  customer: <Users className="h-4 w-4" />,
  supplier: <Truck className="h-4 w-4" />,
  inventory: <Layers className="h-4 w-4" />,
  purchase: <FileText className="h-4 w-4" />,
  role: <Shield className="h-4 w-4" />,
  permission: <Key className="h-4 w-4" />,
  outlet: <Store className="h-4 w-4" />,
  default: <User className="h-4 w-4" />, // Fallback icon
};
