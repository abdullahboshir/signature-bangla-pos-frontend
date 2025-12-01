'use client';

import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Settings,
  Search,
  AlertCircle,
} from 'lucide-react';

import { TablePagination } from './TablePagination';
import { TableSkeleton } from './TableSkeleton';
import { TableConfig } from './TableConfig';
import { TableFilters } from './TableFilters';
import { generateColumns } from '@/lib/data-table/utils';
import { DataType, TableConfig as ITableConfig } from '@/types/data-table';

interface DynamicDataTableProps<T> {
  dataType: DataType;
  data: T[];
  total?: number;
  isLoading?: boolean;
  error?: string;
  config?: Partial<ITableConfig>;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onFilterChange?: (filters: any) => void;
  onCreate?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  onRefresh?: () => void;
  currentPage?: number;
  pageSize?: number;
}

export function DynamicDataTable<T extends Record<string, any>>({
  dataType,
  data,
  total = 0,
  isLoading = false,
  error,
  config,
  onPageChange,
  onSortChange,
  onFilterChange,
  onCreate,
  onEdit,
  onDelete,
  onView,
  onExport,
  onRefresh,
  currentPage = 1,
  pageSize = 10,
}: DynamicDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Get table configuration
  const tableConfig = TableConfig[dataType] || TableConfig.default;
  const mergedConfig = { ...tableConfig, ...config };

  // Generate columns based on config
  const columns = generateColumns<T>(mergedConfig, {
    onEdit,
    onDelete,
    onView,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    manualPagination: !!onPageChange,
    pageCount: Math.ceil(total / pageSize),
  });

  // Handle external page changes
  useEffect(() => {
    if (onPageChange && currentPage !== table.getState().pagination.pageIndex + 1) {
      table.setPageIndex(currentPage - 1);
    }
  }, [currentPage]);

  // Handle sort changes
  useEffect(() => {
    if (onSortChange && sorting.length > 0) {
      const { id, desc } = sorting[0];
      onSortChange(id, desc ? 'desc' : 'asc');
    }
  }, [sorting]);

  if (isLoading) {
    return <TableSkeleton columns={mergedConfig.columns.length} rows={5} />;
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-destructive mr-2" />
          <p className="text-sm font-medium text-destructive">Error loading data</p>
        </div>
        <p className="text-sm text-destructive/80 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {mergedConfig.showToolbar !== false && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            {mergedConfig.enableFilters && (
              <TableFilters
                dataType={dataType}
                onFilterChange={onFilterChange}
              />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
            
            {onCreate && mergedConfig.actions?.create !== false && (
              <Button size="sm" onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            )}
            
            {onExport && mergedConfig.actions?.export !== false && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem onSelect={() => onExport('csv')}>
                    CSV
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onSelect={() => onExport('excel')}>
                    Excel
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onSelect={() => onExport('pdf')}>
                    PDF
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {mergedConfig.showPagination !== false && (
        <div className="flex items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {Object.keys(rowSelection).length > 0 ? (
              `${Object.keys(rowSelection).length} of ${data.length} row(s) selected.`
            ) : (
              `Total: ${total} items`
            )}
          </div>
          
          <TablePagination
            table={table}
            total={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}