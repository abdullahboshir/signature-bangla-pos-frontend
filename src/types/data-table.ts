export type DataType = 
  | 'user' 
  | 'product' 
  | 'category' 
  | 'order' 
  | 'customer' 
  | 'supplier'
  | 'inventory'
  | 'purchase'
  | 'role'
  | 'permission';

export interface TableColumn<T = any> {
  id: string;
  header: string;
  accessorKey: string;
  cell?: (props: { row: T; getValue: () => any }) => React.ReactNode;
  filter?: boolean;
  sortable?: boolean;
  width?: number;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'status' | 'actions';
  options?: {
    format?: string;
    trueLabel?: string;
    falseLabel?: string;
    dateFormat?: string;
  };
}

export interface TableConfig {
  dataType: DataType;
  columns: TableColumn[];
  defaultSort?: { id: string; desc: boolean };
  pageSize?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
  showExport?: boolean;
  enableSelection?: boolean;
  enableFilters?: boolean;
  actions?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    export?: boolean;
    custom?: Array<{
      label: string;
      icon: React.ReactNode;
      onClick: (selectedRows: any[]) => void;
    }>;
  };
}

export interface TableData<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface TableFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string[];
  dateRange?: { from: Date; to: Date };
  [key: string]: any;
}