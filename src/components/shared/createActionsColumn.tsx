import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

/**
 * Creates a generic actions column for DataTable
 * 
 * @param onEdit - Callback when edit is clicked
 * @param onDelete - Callback when delete is clicked
 * @param options - Optional configuration
 * @returns Column definition for actions
 * 
 * @example
 * const columns = [
 *   { accessorKey: "name", header: "Name" },
 *   createActionsColumn(handleEdit, handleDelete),
 * ];
 */
export const createActionsColumn = <T extends { _id: string }>(
    onEdit: (item: T) => void,
    onDelete: (id: string) => void,
    options?: {
        /** Custom edit label */
        editLabel?: string;
        /** Custom delete label */
        deleteLabel?: string;
        /** Hide edit action */
        hideEdit?: boolean;
        /** Hide delete action */
        hideDelete?: boolean;
        /** Additional menu items */
        additionalActions?: Array<{
            label: string;
            icon?: React.ComponentType<{ className?: string }>;
            onClick: (item: T) => void;
            className?: string;
        }>;
    }
): ColumnDef<T> => ({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                {/* Edit Action */}
                {!options?.hideEdit && (
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {options?.editLabel || "Edit"}
                    </DropdownMenuItem>
                )}

                {/* Additional Actions */}
                {options?.additionalActions?.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => action.onClick(row.original)}
                            className={action.className}
                        >
                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                            {action.label}
                        </DropdownMenuItem>
                    );
                })}

                {/* Delete Action */}
                {!options?.hideDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(row.original._id)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {options?.deleteLabel || "Delete"}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    ),
});
