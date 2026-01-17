'use client';

import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Filter,
  X,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Tag,
  User,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DataType } from '@/types/data-table';
import { getFilterOptions } from '@/lib/data-table/utils';

interface TableFiltersProps {
  dataType: DataType;
  onFilterChange: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
}

export function TableFilters({
  dataType,
  onFilterChange,
  initialFilters = {},
}: TableFiltersProps) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const filterOptions = getFilterOptions(dataType);
  const dataTypeIcons = {
    user: <User className="h-4 w-4" />,
    product: <Package className="h-4 w-4" />,
    order: <ShoppingCart className="h-4 w-4" />,
    customer: <Users className="h-4 w-4" />,
    category: <Tag className="h-4 w-4" />,
  };

  // Initialize filters based on dataType
  useEffect(() => {
    const defaultFilters: Record<string, any> = {};

    switch (dataType) {
      case 'user':
        defaultFilters.role = [];

        break;
      case 'product':
        defaultFilters.category = [];
        defaultFilters.stockStatus = [];
        defaultFilters.priceRange = { min: 0, max: 100000 };
        break;
      case 'order':
        defaultFilters.orderStatus = [];
        defaultFilters.paymentStatus = [];
        break;

    }

    setFilters(prev => ({ ...defaultFilters, ...prev }));
  }, [dataType]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: Record<string, any> = {};
    setFilters(clearedFilters);
    setDateRange({});
    onFilterChange(clearedFilters);
  };

  // Render specific filters based on dataType
  const renderDataTypeSpecificFilters = () => {
    switch (dataType) {
      case 'user':
        return (
          <>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={filters.role || ''}
                onValueChange={(value) => handleFilterChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                {['active', 'inactive', 'suspended'].map((status) => (
                  <Button
                    key={status}
                    variant={filters.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('status', status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </>
        );

      case 'customer':
        return (
          <>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                {['active', 'inactive', 'vip', 'regular', 'new'].map((status) => (
                  <Button
                    key={status}
                    variant={filters.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('status', status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </>
        );

      case 'order':
        return (
          <>
            <div className="space-y-2">
              <Label>Order Status</Label>
              <div className="flex flex-wrap gap-1">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <Badge
                    key={status}
                    variant={filters.orderStatus?.includes(status) ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      const current = filters.orderStatus || [];
                      const newStatus = current.includes(status)
                        ? current.filter((s: string) => s !== status)
                        : [...current, status];
                      handleFilterChange('orderStatus', newStatus);
                    }}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={filters.paymentStatus || ''}
                onValueChange={(value) => handleFilterChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const activeFiltersCount = Object.keys(filters).filter(
    key => filters[key] !== undefined && filters[key] !== ''
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-9 justify-start text-left font-normal',
              !dateRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              'Date'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange as any}
            onSelect={(range) => {
              setDateRange(range || {});
              if (range?.from && range?.to) {
                handleFilterChange('dateRange', range);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Data Type Specific Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            {dataTypeIcons[dataType as keyof typeof dataTypeIcons] || <Filter className="h-4 w-4" />}
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 bg-primary/20">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Filters</h4>
            <div className="space-y-4">
              {renderDataTypeSpecificFilters()}

              {/* Search Filter */}
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy || ''}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="updatedAt">Last Updated</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
