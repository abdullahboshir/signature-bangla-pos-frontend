import { TableActions } from '@/components/data-display/tables/TableActions';
import type { ReactNode } from 'react';

interface ActionCellProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onCopy?: (item: T) => void;
  customActions?: Array<{
    id: string;
    label: string;
    icon: ReactNode;
    onClick: (item: T) => void;
  }>;
  showDropdown?: boolean;
}

export function ActionCell<T>({
  item,
  onEdit,
  onDelete,
  onView,
  onCopy,
  customActions = [],
  showDropdown = true,
}: ActionCellProps<T>) {
  const actions = {
    view: onView,
    edit: onEdit,
    delete: onDelete,
    copy: onCopy,
  };

  return (
    <TableActions
      item={item}
      actions={actions}
      customActions={customActions}
      showDropdown={showDropdown}
    />
  );
}
