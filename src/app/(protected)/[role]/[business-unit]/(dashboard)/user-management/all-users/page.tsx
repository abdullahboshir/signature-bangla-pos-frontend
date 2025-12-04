'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { DynamicDataTable } from '@/components/data-display/tables/DaynamicDataTable';
import { useGetAllUsersQuery } from '@/redux/api/userApi';

export default function AllUsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({});
  
  const { data, isLoading, error, refetch } = useGetAllUsersQuery({
    page,
    limit,
    ...filters,
  }) as any;


  if(isLoading) return <div>Loading...</div>
  if(error) return <div>Error: {error.message}</div>
  console.log('userssssssssssssssssssssssssssssssss', data)

  const handleCreateUser = () => {
    // Open create user modal
  };

  const handleEditUser = (user: any) => {
    // Open edit user modal
  };

  const handleDeleteUser = (user: any) => {
    // Confirm and delete user
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Handle export
    console.log('Exporting as:', format);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users and their permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExport('csv')} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateUser} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DynamicDataTable
            dataType="user"
            data={data?.data || []}
            total={data?.total || 0}
            isLoading={isLoading}
            error={error}
            currentPage={page}
            pageSize={limit}
            onPageChange={setPage}
            onFilterChange={setFilters}
            onCreate={handleCreateUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onExport={handleExport}
            onRefresh={refetch}
            config={{
              actions: {
                create: true,
                edit: true,
                delete: true,
                view: true,
                export: true,
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}