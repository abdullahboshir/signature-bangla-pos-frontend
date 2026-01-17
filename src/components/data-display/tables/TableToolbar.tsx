// components/data-display/tables/TableToolbar.tsx
"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./TableViewOptions"
import { DataTableFacetedFilter } from "./TableFacetedFilter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
  filters?: {
    column: string
    title: string
    options: { label: string; value: string; icon?: React.ComponentType }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filters?.map((filter) => (
          <DataTableFacetedFilter
            key={filter.column}
            column={table.getColumn(filter.column)}
            title={filter.title}
            options={filter.options}
          />
        ))}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
