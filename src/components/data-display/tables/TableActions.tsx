'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Archive,
  Download,
  Ban,
  CheckCircle,
  Link,
  Send,
  Printer,
  Share2,
  RefreshCw,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Heart,
  Bookmark,
  Upload,
  QrCode,
  BarChart,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type ActionType =
  | 'view'
  | 'edit'
  | 'delete'
  | 'copy'
  | 'archive'
  | 'download'
  | 'activate'
  | 'deactivate'
  | 'approve'
  | 'reject'
  | 'send'
  | 'print'
  | 'share'
  | 'refresh'
  | 'lock'
  | 'unlock'
  | 'email'
  | 'call'
  | 'location'
  | 'schedule'
  | 'export'
  | 'import'
  | 'qr'
  | 'analytics'
  | 'settings'
  | 'favorite'
  | 'bookmark'
  | 'link'
  | 'status'
  | 'custom';

export interface CustomAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive' | 'secondary' | 'ghost';
  shortcut?: string;
  disabled?: boolean;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  className?: string;
}

export interface TableActionsProps<T> {
  item: T;
  actions?: {
    view?: (item: T) => void;
    edit?: (item: T) => void;
    delete?: (item: T) => void;
    copy?: (item: T) => void;
    archive?: (item: T) => void;
    download?: (item: T) => void;
    activate?: (item: T) => void;
    deactivate?: (item: T) => void;
    approve?: (item: T) => void;
    reject?: (item: T) => void;
    send?: (item: T) => void;
    print?: (item: T) => void;
    share?: (item: T) => void;
    refresh?: (item: T) => void;
    lock?: (item: T) => void;
    unlock?: (item: T) => void;
    email?: (item: T) => void;
    call?: (item: T) => void;
    location?: (item: T) => void;
    schedule?: (item: T) => void;
    export?: (item: T) => void;
    import?: (item: T) => void;
    qr?: (item: T) => void;
    analytics?: (item: T) => void;
    settings?: (item: T) => void;
    favorite?: (item: T) => void;
    bookmark?: (item: T) => void;
    link?: (item: T) => void;
  };
  customActions?: CustomAction[];
  showDropdown?: boolean;
  showIcons?: boolean;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'expanded';
  position?: 'end' | 'start';
  className?: string;
  disabled?: boolean;
  onActionComplete?: (action: string, item: T) => void;
}

const actionIcons: Record<string, React.ReactNode> = {
  view: <Eye className="h-4 w-4" />,
  edit: <Edit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  copy: <Copy className="h-4 w-4" />,
  archive: <Archive className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
  activate: <CheckCircle className="h-4 w-4" />,
  deactivate: <Ban className="h-4 w-4" />,
  approve: <UserCheck className="h-4 w-4" />,
  reject: <UserX className="h-4 w-4" />,
  send: <Send className="h-4 w-4" />,
  print: <Printer className="h-4 w-4" />,
  share: <Share2 className="h-4 w-4" />,
  refresh: <RefreshCw className="h-4 w-4" />,
  lock: <Lock className="h-4 w-4" />,
  unlock: <Unlock className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  schedule: <Calendar className="h-4 w-4" />,
  export: <Upload className="h-4 w-4" />,
  import: <Download className="h-4 w-4" />,
  qr: <QrCode className="h-4 w-4" />,
  analytics: <BarChart className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  favorite: <Heart className="h-4 w-4" />,
  bookmark: <Bookmark className="h-4 w-4" />,
  link: <Link className="h-4 w-4" />,
};

const actionLabels: Record<string, string> = {
  view: 'View Details',
  edit: 'Edit',
  delete: 'Delete',
  copy: 'Duplicate',
  archive: 'Archive',
  download: 'Download',
  activate: 'Activate',
  deactivate: 'Deactivate',
  approve: 'Approve',
  reject: 'Reject',
  send: 'Send',
  print: 'Print',
  share: 'Share',
  refresh: 'Refresh',
  lock: 'Lock',
  unlock: 'Unlock',
  email: 'Send Email',
  call: 'Call',
  location: 'View Location',
  schedule: 'Schedule',
  export: 'Export',
  import: 'Import',
  qr: 'Generate QR',
  analytics: 'Analytics',
  settings: 'Settings',
  favorite: 'Add to Favorites',
  bookmark: 'Bookmark',
  link: 'Copy Link',
};

export function TableActions<T>({
  item,
  actions = {},
  customActions = [],
  showDropdown = true,
  showIcons = true,
  showLabels = true,
  variant = 'default',
  position = 'end',
  className,
  disabled = false,
  onActionComplete,
}: TableActionsProps<T>) {
  const [confirmationAction, setConfirmationAction] = useState<{
    type: string;
    handler: (item: T) => void;
    message: string;
  } | null>(null);

  // Filter available actions
  const availableActions = Object.entries(actions)
    .filter(([_, handler]) => typeof handler === 'function')
    .map(([type, handler]) => ({ type, handler }));

  const hasActions = availableActions.length > 0 || customActions.length > 0;

  if (!hasActions) return null;

  const handleAction = (
    type: string,
    handler: (item: T) => void,
    requiresConfirmation?: boolean,
    confirmationMessage?: string
  ) => {
    if (requiresConfirmation) {
      setConfirmationAction({
        type,
        handler,
        message: confirmationMessage || `Are you sure you want to ${type} this item?`,
      });
    } else {
      handler(item);
      onActionComplete?.(type, item);
    }
  };

  const confirmAction = () => {
    if (confirmationAction) {
      confirmationAction.handler(item);
      onActionComplete?.(confirmationAction.type, item);
      setConfirmationAction(null);
    }
  };

  // Render action button
  const renderActionButton = (
    type: string,
    handler: (item: T) => void,
    customAction?: CustomAction
  ) => {
    const icon = customAction?.icon || actionIcons[type];
    const label = customAction?.label || actionLabels[type] || type;
    const variant = customAction?.variant ||
      (type === 'delete' || type === 'reject' ? 'destructive' : 'ghost');

    const button = (
      <Button
        variant={variant}
        size="sm"
        className={cn(
          'h-8 px-2',
          customAction?.className
        )}
        onClick={() => handleAction(
          type,
          handler,
          customAction?.requiresConfirmation,
          customAction?.confirmationMessage
        )}
        disabled={disabled || customAction?.disabled}
      >
        {showIcons && icon}
        {showLabels && <span className="ml-2">{label}</span>}
      </Button>
    );

    if (customAction?.shortcut) {
      return (
        <TooltipProvider key={type}>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
              <p>Shortcut: {customAction.shortcut}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  // Render dropdown menu item
  const renderDropdownItem = (
    type: string,
    handler: (item: T) => void,
    customAction?: CustomAction
  ) => {
    const icon = customAction?.icon || actionIcons[type];
    const label = customAction?.label || actionLabels[type] || type;
    const variant = customAction?.variant;

    return (
      <DropdownMenuItem
        key={type}
        className={cn(
          variant === 'destructive' && 'text-destructive focus:text-destructive',
          customAction?.className
        )}
        onClick={() => handleAction(
          type,
          handler,
          customAction?.requiresConfirmation,
          customAction?.confirmationMessage
        )}
        disabled={disabled || customAction?.disabled}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
        {customAction?.shortcut && (
          <DropdownMenuShortcut>{customAction.shortcut}</DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
    );
  };

  // Group actions by category
  const groupedActions = {
    primary: availableActions.filter(({ type }) =>
      ['view', 'edit', 'delete'].includes(type)
    ),
    secondary: availableActions.filter(({ type }) =>
      !['view', 'edit', 'delete'].includes(type)
    ),
    custom: customActions,
  };

  // Compact view (icon buttons)
  if (!showDropdown) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {/* Primary actions */}
        {groupedActions.primary.map(({ type, handler }) => (
          <TooltipProvider key={type}>
            <Tooltip>
              <TooltipTrigger asChild>
                {renderActionButton(type, handler)}
              </TooltipTrigger>
              <TooltipContent>
                <p>{actionLabels[type] || type}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {/* More actions dropdown if there are secondary/custom actions */}
        {(groupedActions.secondary.length > 0 || groupedActions.custom.length > 0) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={disabled}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={position}>
              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Secondary actions */}
              {groupedActions.secondary.map(({ type, handler }) =>
                renderDropdownItem(type, handler)
              )}

              {/* Custom actions */}
              {groupedActions.custom.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Custom Actions</DropdownMenuLabel>
                  {groupedActions.custom.map((action) =>
                    renderDropdownItem(action.id, action.onClick, action)
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={!!confirmationAction} onOpenChange={() => setConfirmationAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmationAction?.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmAction} className="bg-destructive text-destructive-foreground">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Dropdown view
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn('h-8 w-8 p-0', className)}
            disabled={disabled}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={position} className="w-56">
          {/* Primary Actions Group */}
          {groupedActions.primary.length > 0 && (
            <>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                {groupedActions.primary.map(({ type, handler }) =>
                  renderDropdownItem(type, handler)
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Secondary Actions Group */}
          {groupedActions.secondary.length > 0 && (
            <>
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                {groupedActions.secondary.map(({ type, handler }) =>
                  renderDropdownItem(type, handler)
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Custom Actions Group */}
          {groupedActions.custom.length > 0 && (
            <>
              <DropdownMenuLabel>Custom Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                {groupedActions.custom.map((action) =>
                  renderDropdownItem(action.id, action.onClick, action)
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Status/Info Section */}
          {typeof item === 'object' && item !== null && 'status' in (item as any) && (
            <>
              <div className="px-2 py-1.5">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <Badge
                  variant={
                    (item as any).status === 'active' ? 'default' :
                      (item as any).status === 'inactive' ? 'secondary' :
                        'outline'
                  }
                  className="capitalize"
                >
                  {(item as any).status}
                </Badge>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Quick Links */}
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <FileText className="mr-2 h-4 w-4" />
              <span>Generate Report</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Open in New Tab</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmationAction} onOpenChange={() => setConfirmationAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationAction?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={cn(
                confirmationAction?.type === 'delete' && 'bg-destructive text-destructive-foreground'
              )}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Pre-configured action sets for common use cases
export function UserActions<T>(props: TableActionsProps<T>) {
  const subset = {
    view: props.actions?.view,
    edit: props.actions?.edit,
    delete: props.actions?.delete,
    activate: props.actions?.activate,
    deactivate: props.actions?.deactivate,
    email: props.actions?.email,
  };
  return <TableActions {...props} actions={subset} />;
}

export function ProductActions<T>(props: TableActionsProps<T>) {
  const subset = {
    view: props.actions?.view,
    edit: props.actions?.edit,
    delete: props.actions?.delete,
    copy: props.actions?.copy,
    archive: props.actions?.archive,
    qr: props.actions?.qr,
    analytics: props.actions?.analytics,
  };
  return <TableActions {...props} actions={subset} />;
}

export function OrderActions<T>(props: TableActionsProps<T>) {
  const subset = {
    view: props.actions?.view,
    edit: props.actions?.edit,
    delete: props.actions?.delete,
    print: props.actions?.print,
    send: props.actions?.send,
    approve: props.actions?.approve,
    reject: props.actions?.reject,
    email: props.actions?.email,
  };
  return <TableActions {...props} actions={subset} />;
}

// Action builder for creating custom action sets
export function createActionSet<T>(
  actions: Partial<TableActionsProps<T>['actions']>
) {
  return function ActionSet(props: Omit<TableActionsProps<T>, 'actions'>) {
    return <TableActions {...props} actions={actions} />;
  };
}

// Utility to generate action handlers
export const actionHandlers = {
  confirmDelete: (item: any, onDelete: () => void) => ({
    delete: {
      handler: onDelete,
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to delete "${item.name || 'this item'}"? This action cannot be undone.`,
    },
  }),

  toggleStatus: (item: any, onToggle: () => void) => ({
    [item.status === 'active' ? 'deactivate' : 'activate']: {
      handler: onToggle,
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to ${item.status === 'active' ? 'deactivate' : 'activate'} this item?`,
    },
  }),
};
