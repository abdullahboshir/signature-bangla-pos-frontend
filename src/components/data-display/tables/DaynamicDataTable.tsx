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
  getExpandedRowModel,
  Row,
  ExpandedState,
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
  Download,
  Plus,
  RefreshCw,
  Settings,
  Search,
  AlertCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { TablePagination } from './TablePagination';
import { TableSkeleton } from './TableSkeleton';
import { TableConfig } from './TableConfig';
import { TableFilters } from './TableFilters';
import { generateColumns } from '@/lib/data-table/utils';
import { DataType, TableConfig as ITableConfig, TableQuickFilter } from '@/types/data-table';
import { cn } from '@/lib/utils';

// ... other imports

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
  renderSubComponent?: (row: Row<T>) => React.ReactNode;
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
  renderSubComponent,
}: DynamicDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Get table configuration
  const tableConfig = TableConfig[dataType] || TableConfig.default;
  const mergedConfig = { ...tableConfig, ...config };
  const quickFilters = mergedConfig.quickFilters || [];
  const toolbarPlaceholder = mergedConfig.toolbar?.placeholder || 'Search...';
  const showSearch = mergedConfig.toolbar?.showSearch !== false;

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
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => !!renderSubComponent,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      expanded,
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

  // ... (Keep handleQuickFilter and clearQuickFilters logic same) ...

  const handleQuickFilter = (filter: TableQuickFilter) => {
    const column = table.getColumn(filter.column);
    if (!column) return;
    const isActive = activeQuickFilter === filter.id;

    column.setFilterValue(isActive ? undefined : filter.value);
    setActiveQuickFilter(isActive ? null : filter.id);
  };

  const clearQuickFilters = () => {
    if (!activeQuickFilter) return;
    const currentFilter = quickFilters.find((filter) => filter.id === activeQuickFilter);
    if (currentFilter) {
      const column = table.getColumn(currentFilter.column);
      column?.setFilterValue(undefined);
    }
    setActiveQuickFilter(null);
  };

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
      {/* Toolbar - (Keep same) */}
      {mergedConfig.showToolbar !== false && (
        <div className="space-y-4 rounded-md border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {showSearch && (
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={toolbarPlaceholder}
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-9 pl-8"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {table.getRowModel().rows.length} of {total || data.length} records
                </span>
                {Object.keys(rowSelection).length > 0 && (
                  <Badge variant="secondary" className="uppercase">
                    {Object.keys(rowSelection).length} selected
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden rounded-md border bg-background p-1 text-xs font-medium sm:flex">
                <Button
                  variant={density === 'comfortable' ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn("h-8 px-3", density === 'comfortable' && "dark:!text-gray-900")}
                  onClick={() => setDensity('comfortable')}
                >
                  Cozy
                </Button>
                <Button
                  variant={density === 'compact' ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn("h-8 px-3", density === 'compact' && "dark:!text-gray-900")}
                  onClick={() => setDensity('compact')}
                >
                  Compact
                </Button>
              </div>

              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="h-9"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Settings className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
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
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {onExport && mergedConfig.actions?.export !== false && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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

              {onCreate && mergedConfig.actions?.create !== false && (
                <Button size="sm" className="h-9" onClick={onCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              )}
            </div>
          </div>

          {mergedConfig.enableFilters && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <TableFilters
                dataType={dataType}
                onFilterChange={onFilterChange}
              />
            </div>
          )}

          {quickFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Quick filters
              </span>
              {quickFilters.map((filter) => (
                <Button
                  key={filter.id}
                  size="sm"
                  variant={activeQuickFilter === filter.id ? 'default' : 'outline'}
                  onClick={() => handleQuickFilter(filter)}
                >
                  {filter.label}
                </Button>
              ))}
              {activeQuickFilter && (
                <Button variant="ghost" size="sm" onClick={clearQuickFilters}>
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          'whitespace-nowrap text-left align-middle font-semibold text-muted-foreground',
                          density === 'compact' ? 'py-2 text-xs' : 'py-3 text-sm'
                        )}
                      >
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
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        'border-b last:border-b-0 cursor-pointer',
                        density === 'compact' ? 'h-10' : 'h-14',
                        row.getIsExpanded() && 'bg-muted/50 border-b-0'
                      )}
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'whitespace-nowrap align-middle',
                            density === 'compact' ? 'py-1 text-sm' : 'py-3'
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && renderSubComponent && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <div className="p-4">
                            {renderSubComponent(row)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
      </div>

      {/* Pagination */}
      {mergedConfig.showPagination !== false && (
        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            {Object.keys(rowSelection).length > 0 ? (
              `${Object.keys(rowSelection).length} selected • Total ${total} items`
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