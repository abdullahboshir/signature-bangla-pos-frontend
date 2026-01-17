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

import { DataTableViewOptions } from './TableViewOptions'; // Import View Options
import { Badge } from '@/components/ui/badge';

import { TablePagination } from './TablePagination';
import { TableSkeleton } from './TableSkeleton';
import { TableConfig } from './TableConfig';
import { TableFilters } from './TableFilters';
import { generateColumns } from '@/lib/data-table/utils';
import { DataType, TableConfig as ITableConfig, TableQuickFilter } from '@/types/data-table';
import { cn } from '@/lib/utils';

interface DynamicDataTableProps<T> {
  dataType: DataType;
  data: T[];
  total?: number;
  isLoading?: boolean;
  error?: string;
  config?: Partial<ITableConfig>;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onFilterChange?: (filters: Record<string, any>) => void;
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
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Get table configuration
  const tableConfig = TableConfig[dataType] || (TableConfig as any).default;
  const mergedConfig = { ...tableConfig, ...config };

  const toolbarPlaceholder = mergedConfig.toolbar?.placeholder || 'Search...';
  const showSearch = mergedConfig.toolbar?.showSearch !== false;
  const quickFilters = mergedConfig.quickFilters || [];

  const columns = React.useMemo(() => generateColumns<T>(mergedConfig, {
    onEdit,
    onDelete,
    onView,
  }), [mergedConfig, onEdit, onDelete, onView]);

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
    pageCount: total && pageSize ? Math.ceil(total / pageSize) : -1,
  });

  // Handle external page changes
  useEffect(() => {
    if (onPageChange && currentPage !== table.getState().pagination.pageIndex + 1) {
      table.setPageIndex(currentPage - 1);
    }
  }, [currentPage, onPageChange, table]);

  // Handle sort changes
  useEffect(() => {
    if (onSortChange && sorting.length > 0) {
      const { id, desc } = sorting[0];
      onSortChange(id, desc ? 'desc' : 'asc');
    }
  }, [sorting, onSortChange]);

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
      {/* Toolbar */}
      {mergedConfig.showToolbar !== false && (
        <div className="space-y-4 rounded-md border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 w-full">
            {showSearch && (
              <div className="relative w-full sm:max-w-xs md:max-w-[200px] lg:max-w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={toolbarPlaceholder}
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="h-9 pl-8"
                />
              </div>
            )}

            {mergedConfig.enableFilters && (
              <TableFilters
                dataType={dataType}
                onFilterChange={onFilterChange || (() => { })}
              />
            )}

            <div className="flex items-center gap-2 ml-auto">
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              )}

              <DataTableViewOptions
                table={table}
              />

              {onExport && (
                <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}

              {onCreate && (
                <Button size="sm" onClick={onCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              )}
            </div>
          </div>

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
                        className='whitespace-nowrap text-left align-middle font-semibold text-muted-foreground py-3 text-sm h-[var(--table-row-height,56px)]'
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
                        'border-b last:border-b-0 cursor-pointer h-[var(--table-row-height,56px)]',
                        row.getIsExpanded() && 'bg-muted/50 border-b-0'
                      )}
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className='whitespace-nowrap align-middle py-2 h-[var(--table-row-height,56px)]'
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
      {
        mergedConfig.showPagination !== false && (
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
            />
          </div>
        )
      }
    </div >
  );
}
