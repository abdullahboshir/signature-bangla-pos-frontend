'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { DynamicDataTable } from '@/components/data-display/tables/DaynamicDataTable';

// Dummy product data - replace with API call later
const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    sku: 'TSH-001',
    category: { name: 'Clothing', id: 'cat-1' },
    price: 29.99,
    stock: 150,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Wireless Bluetooth Headphones',
    sku: 'ELC-002',
    category: { name: 'Electronics', id: 'cat-2' },
    price: 89.99,
    stock: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Organic Green Tea (100g)',
    sku: 'GRO-003',
    category: { name: 'Grocery', id: 'cat-3' },
    price: 12.50,
    stock: 8,
    status: 'low-stock',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=100&h=100&fit=crop',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Leather Wallet',
    sku: 'ACC-004',
    category: { name: 'Accessories', id: 'cat-4' },
    price: 45.00,
    stock: 0,
    status: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    name: 'Running Shoes - Men',
    sku: 'SHO-005',
    category: { name: 'Footwear', id: 'cat-5' },
    price: 79.99,
    stock: 65,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    sku: 'HOM-006',
    category: { name: 'Home & Kitchen', id: 'cat-6' },
    price: 24.99,
    stock: 120,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '7',
    name: 'Yoga Mat Premium',
    sku: 'SPO-007',
    category: { name: 'Sports', id: 'cat-7' },
    price: 35.00,
    stock: 88,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-30'),
  },
  {
    id: '8',
    name: 'Smart Watch Series 5',
    sku: 'ELC-008',
    category: { name: 'Electronics', id: 'cat-2' },
    price: 299.99,
    stock: 22,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
    createdAt: new Date('2024-02-15'),
  },
];

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({});

  // Simulate loading state
  const isLoading = false;
  const error = null;

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = DUMMY_PRODUCTS.slice(startIndex, endIndex);
  const total = DUMMY_PRODUCTS.length;

  const handleCreateProduct = () => {
    console.log('Create product modal');
    // TODO: Open create product modal
  };

  const handleEditProduct = (product: any) => {
    console.log('Edit product:', product);
    // TODO: Open edit product modal with product data
  };

  const handleDeleteProduct = (product: any) => {
    console.log('Delete product:', product);
    // TODO: Show confirmation dialog and delete
  };

  const handleViewProduct = (product: any) => {
    console.log('View product:', product);
    // TODO: Navigate to product details page or open modal
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log('Exporting products as:', format);
    // TODO: Implement export functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing products...');
    // TODO: Refetch data from API
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExport('csv')} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateProduct} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DynamicDataTable
            dataType="product"
            data={paginatedProducts}
            total={total}
            isLoading={isLoading}
            error={error}
            currentPage={page}
            pageSize={limit}
            onPageChange={setPage}
            onFilterChange={setFilters}
            onCreate={handleCreateProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onView={handleViewProduct}
            onExport={handleExport}
            onRefresh={handleRefresh}
            config={{
              actions: {
                create: true,
                edit: true,
                delete: true,
                view: true,
                export: true,
              },
              enableFilters: true,
              showPagination: true,
              enableSelection: true,
              toolbar: {
                placeholder: 'Search products...',
              },
              quickFilters: [
                { id: 'in-stock', label: 'In Stock', column: 'status', value: 'active' },
                { id: 'low-stock', label: 'Low Stock', column: 'status', value: 'low-stock' },
                { id: 'out-of-stock', label: 'Out of Stock', column: 'status', value: 'out-of-stock' },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}