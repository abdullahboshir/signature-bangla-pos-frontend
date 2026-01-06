import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";

interface RoleAssignmentRowProps {
    assignment: {
        role: string;
        businessUnit: string;
        outlet: string | null;
        tempId: string;
    };
    roles: any[];
    businessUnits: any[];
    onUpdate: (id: string, field: string, value: any) => void;
    onRemove: (id: string) => void;
    lockedBusinessUnitId?: string;
}

export function RoleAssignmentRow({
    assignment,
    roles,
    businessUnits,
    onUpdate,
    onRemove,
    lockedBusinessUnitId
}: RoleAssignmentRowProps) {
    // Fetch outlets for this specific row's Business Unit
    const { data: outletsData, isLoading: isOutletsLoading } = useGetOutletsQuery(
        assignment.businessUnit ? { businessUnit: assignment.businessUnit } : { businessUnit: 'none' },
        { skip: !assignment.businessUnit }
    );

    const outlets = Array.isArray(outletsData) ? outletsData : (outletsData?.data || []);

    const filteredRoles = React.useMemo(() => {
        if (assignment.businessUnit) {
            // Business Context: Show Business and Outlet roles
            return roles.filter((r: any) => r.roleScope !== 'GLOBAL');
        } else {
            // Global Context (No BU selected): Show Global roles only
            return roles.filter((r: any) => r.roleScope === 'GLOBAL');
        }
    }, [roles, assignment.businessUnit]);

    return (
        <TableRow>
            <TableCell>
                <Select
                    value={assignment.role}
                    onValueChange={(val) => onUpdate(assignment.tempId, "role", val)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredRoles.map((role: any) => (
                            <SelectItem key={role._id} value={role._id}>
                                {role.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Select
                    value={assignment.businessUnit}
                    onValueChange={(val) => {
                        onUpdate(assignment.tempId, "businessUnit", val);
                        onUpdate(assignment.tempId, "outlet", null); // Reset outlet
                    }}
                    disabled={!!lockedBusinessUnitId}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Scope" />
                    </SelectTrigger>
                    <SelectContent>
                        {businessUnits.map((bu: any) => (
                            <SelectItem key={bu._id} value={bu._id}>
                                {bu.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Select
                    value={assignment.outlet || "none"}
                    onValueChange={(val) => onUpdate(assignment.tempId, "outlet", val === "none" ? null : val)}
                    disabled={!assignment.businessUnit || isOutletsLoading}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Outlets" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">All Outlets</SelectItem>
                        {outlets.map((outlet: any) => (
                            <SelectItem key={outlet._id} value={outlet._id}>
                                {outlet.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(assignment.tempId)}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
