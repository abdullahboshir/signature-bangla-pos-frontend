"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users, User, Search, MoreHorizontal, Edit, Trash2, ShieldCheck, MapPin, Smartphone, CheckCircle, RefreshCw, Download, Check, X, Building, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { usePermissions } from "@/hooks/usePermissions"
import { useCurrentRole } from "@/hooks/useCurrentRole"
import { USER_ROLES, USER_STATUS, isSuperAdmin as checkIsSuperAdmin, normalizeAuthString, matchesRole, isManager, isPlatformLevel } from "@/config/auth-constants"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { DataTable } from "@/components/shared/DataTable"
import { DataPageLayout } from "@/components/shared/DataPageLayout"
import { StatCard } from "@/components/shared/StatCard"
import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useGetAllUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from "@/redux/api/iam/userApi"

import Swal from "sweetalert2"


import { PERMISSION_KEYS } from "@/config/permission-keys"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi"
import { useGetRolesQuery } from "@/redux/api/iam/roleApi"
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi"

// Local constants removed, using centralized ones

interface UserManagementTableProps {
    viewScope?: 'platform' | 'business' | 'all';
}

export function UserManagementTable({ viewScope = 'all' }: UserManagementTableProps) {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId');
    const { currentBusinessUnit } = useCurrentBusinessUnit();
    const { user: currentUser } = useAuth();

    const [activeTab, setActiveTab] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [filterBU, setFilterBU] = useState<string>(() => {
        if (params && params["business-unit"] && typeof params["business-unit"] === 'string') {
            return "all";
        }
        return "all"
    })

    // Edit/Create State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)

    // Determine current user role context (Robust Check)
    const isSuperAdmin = useMemo(() => {
        if (currentUser?.isSuperAdmin === true) return true;
        return currentUser?.roles?.some((r: any) =>
            checkIsSuperAdmin(normalizeAuthString(typeof r === 'string' ? r : r.name))
        );
    }, [currentUser]);

    // Sync Filter with Context for Super Admin
    useEffect(() => {
        if (isSuperAdmin && currentBusinessUnit && params && params["business-unit"] && filterBU === 'all') {
            const targetId = currentBusinessUnit._id || currentBusinessUnit.id;
            if (targetId) setFilterBU(targetId);
        }
    }, [isSuperAdmin, currentBusinessUnit, params, filterBU]);

    // RTK Query Hooks
    const {
        data: rawUsers,
        isLoading: isLoadingUsers,
        refetch: refetchUsers
    } = useGetAllUsersQuery({ companyId: companyId || undefined });

    const { hasPermission } = usePermissions();

    const { data: rawRoles = [] } = useGetRolesQuery({ companyId: companyId || undefined });

    // Fetch Business Units for Super Admin to populate dropdown
    const { data: rawBusinessUnits = [] } = useGetBusinessUnitsQuery({ companyId: companyId || undefined }, { skip: !isSuperAdmin });

    // Fetch All Outlets for Lookup (handling missing population)
    const { data: rawOutlets } = useGetOutletsQuery({ limit: 1000 }, { skip: !isSuperAdmin });

    const availableOutlets = useMemo(() => {
        if (!rawOutlets) return [];
        return Array.isArray(rawOutlets) ? rawOutlets : (rawOutlets.data || rawOutlets.result || []);
    }, [rawOutlets]);

    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    // Normalize Users Data
    const users = useMemo(() => {
        let allUsers: any[] = [];
        if (Array.isArray(rawUsers)) {
            allUsers = rawUsers;
        } else if (rawUsers?.data && Array.isArray(rawUsers.data)) {
            allUsers = rawUsers.data;
        } else if (rawUsers?.result && Array.isArray(rawUsers.result)) {
            allUsers = rawUsers.result;
        } else if (rawUsers?.data?.result && Array.isArray(rawUsers.data.result)) {
            allUsers = rawUsers.data.result;
        }

        if (!isSuperAdmin && currentBusinessUnit) {
            allUsers = allUsers.filter((user: any) => {
                // Check legacy businessUnits array
                const hasLegacyBU = user.businessUnits?.some((bu: any) => {
                    const buId = typeof bu === 'string' ? bu : (bu.id || bu.slug || bu._id);
                    return buId === currentBusinessUnit.id || buId === currentBusinessUnit.slug || buId === currentBusinessUnit._id;
                });

                // Check new permissions structure
                const hasPermissionBU = user.permissions?.some((p: any) => {
                    // Check if permission is directly scoped to this BU
                    const pBuId = p.businessUnit ? (typeof p.businessUnit === 'string' ? p.businessUnit : (p.businessUnit._id || p.businessUnit.id)) : null;
                    if (pBuId === currentBusinessUnit.id || pBuId === currentBusinessUnit.slug || pBuId === currentBusinessUnit._id) return true;

                    // Check if permission is scoped to an Outlet belonging to this BU
                    if (p.outlet && typeof p.outlet === 'object' && p.outlet.businessUnit) {
                        const outletParentBuId = typeof p.outlet.businessUnit === 'string' ? p.outlet.businessUnit : p.outlet.businessUnit._id;
                        if (outletParentBuId === currentBusinessUnit.id || outletParentBuId === currentBusinessUnit._id) return true;
                    }
                    return false;
                });

                return hasLegacyBU || hasPermissionBU;
            });
        } else if (isSuperAdmin && filterBU !== 'all') {
            allUsers = allUsers.filter((user: any) => {
                const hasLegacyBU = user.businessUnits?.some((bu: any) => {
                    const buId = typeof bu === 'string' ? bu : (bu.id || bu.slug || bu._id);
                    return buId === filterBU;
                });

                const hasPermissionBU = user.permissions?.some((p: any) => {
                    const pBuId = p.businessUnit ? (typeof p.businessUnit === 'string' ? p.businessUnit : (p.businessUnit._id || p.businessUnit.id)) : null;
                    if (pBuId === filterBU) return true;

                    if (p.outlet && typeof p.outlet === 'object' && p.outlet.businessUnit) {
                        const outletParentBuId = typeof p.outlet.businessUnit === 'string' ? p.outlet.businessUnit : p.outlet.businessUnit._id;
                        if (outletParentBuId === filterBU) return true;
                    }
                    return false;
                });

                return hasLegacyBU || hasPermissionBU;
            });
        }

        return allUsers.map((user: any) => ({
            ...user,
            name: typeof user.name === 'object' && user.name !== null
                ? `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim() || 'Unnamed'
                : user.name,
        }));
    }, [rawUsers, currentUser, currentBusinessUnit, isSuperAdmin, filterBU, params]);

    // Derived state for filtered users
    const filteredData = useMemo(() => {
        let data = users;


        // Search Filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            data = data.filter((u: any) =>
                u.name?.toLowerCase().includes(lower) ||
                u.email?.toLowerCase().includes(lower) ||
                u.phone?.includes(searchTerm)
            );
        }

        if (activeTab === 'all') {
            if (viewScope === 'platform') {
                return data.filter((u: any) => {
                    // Check Global Roles
                    const hasGlobalRole = u.globalRoles?.length > 0;

                    // Check explicit GLOBAL scope in businessAccess
                    const hasGlobalAccess = u.businessAccess?.some((acc: any) => acc.scope === 'GLOBAL');

                    // Fallback: Check if super-admin (legacy)
                    const isSuperAdmin = u.roles?.some((r: any) =>
                        checkIsSuperAdmin(normalizeAuthString(typeof r === 'string' ? r : r.name))
                    );

                    return hasGlobalRole || hasGlobalAccess || isSuperAdmin;
                });
            }
            if (viewScope === 'business') {
                return data.filter((u: any) => {
                    // Check Business/Outlet Scope
                    const hasBusinessAccess = u.businessAccess?.some((acc: any) =>
                        acc.scope === 'BUSINESS' || acc.scope === 'OUTLET'
                    );

                    // Exclude pure Platform users unless they specifically have business access
                    // (e.g. Super Admin often has access to everything, but for the 'Business Users' list we want actual business staff)
                    return hasBusinessAccess;
                });
            }
            return data;
        }

        if (activeTab === 'staff') {
            return data.filter((u: any) => u.roles?.some((r: any) => {
                const roleName = normalizeAuthString(typeof r === 'string' ? r : r.name);
                // Filter out super-admin from strictly "staff" tab if viewed in business context
                if (viewScope === 'business' && checkIsSuperAdmin(roleName)) return false;
                return matchesRole(roleName, [USER_ROLES.SUPER_ADMIN, USER_ROLES.COMPANY_OWNER, USER_ROLES.ADMIN, USER_ROLES.SALES_ASSOCIATE, USER_ROLES.SUPPORT_AGENT]) || r.isSystemRole;
            }));
        }
        if (activeTab === 'customer') {
            return data.filter((u: any) => u.roles?.some((r: any) =>
                normalizeAuthString(typeof r === 'string' ? r : r.name) === USER_ROLES.CUSTOMER
            ));
        }
        if (activeTab === 'supplier') {
            return data.filter((u: any) => u.roles?.some((r: any) => {
                const roleName = normalizeAuthString(typeof r === 'string' ? r : r.name);
                return matchesRole(roleName, [USER_ROLES.VENDOR, 'supplier']);
            }));
        }
        return data;
    }, [users, searchTerm, activeTab]);

    const availableRoles = useMemo(() => {
        return Array.isArray(rawRoles) ? rawRoles : [];
    }, [rawRoles]);

    const availableBusinessUnits = useMemo(() => {
        return Array.isArray(rawBusinessUnits) ? rawBusinessUnits : [];
    }, [rawBusinessUnits]);

    const { currentRole } = useCurrentRole();

    const handleCreate = () => {
        // Strict Routing based on View Scope
        if (viewScope === 'platform') {
            router.push('/global/user-management/platform-users/add');
            return;
        }

        if (viewScope === 'business') {
            // Check if in scoped context
            if (params["business-unit"]) {
                router.push(`/${params["business-unit"]}/user-management/business-users/add`);
            } else {
                router.push('/global/user-management/business-users/add');
            }
            return;
        }

        // Fallback for generic/legacy views
        if (params["business-unit"]) {
            router.push(`/${params["business-unit"]}/user-management/add-user`);
        } else {
            // Default to business user add if not specified
            router.push('/global/user-management/business-users/add');
        }
    }

    const handleEdit = (user: any) => {
        // setEditingUser(user);
        // setIsModalOpen(true);
        // Navigate to full Edit Page
        const userId = user._id || user.id;
        if (params["business-unit"]) {
            router.push(`/${params["business-unit"]}/user-management/users/${userId}/edit`);
        } else {
            router.push(`/global/user-management/users/${userId}/edit`);
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            if (editingUser) {
                // Edit Mode
                const userId = editingUser._id || editingUser.id;
                const updateData: any = {
                    roles: [data.role],
                    status: data.status,
                };

                // If super admin and BU is provided (though we might not allow moving BUs easily, for now only role/status)
                // If user wants to change BU, we might need logic, but usually users belong to BU

                await updateUser({ id: userId, data: updateData }).unwrap();
                toast.success("User updated successfully");
            } else {
                // Create Mode
                const businessUnitId = isSuperAdmin
                    ? data.businessUnit
                    : (currentBusinessUnit?.id || params["business-unit"]);

                const createPayload = {
                    name: { firstName: data.firstName, lastName: data.lastName },
                    email: data.email,
                    phone: data.phone,
                    password: data.password || "default123",
                    roles: [data.role],
                    // Send businessUnits ONLY if we have a valid ID. For global users it should be empty.
                    businessUnits: businessUnitId ? [businessUnitId] : [],
                    status: USER_STATUS.ACTIVE
                };
                await createUser(createPayload).unwrap();
                toast.success("User created successfully");
            }
            setIsModalOpen(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.message || err?.message || "Operation failed");
        }
    };

    const handleDelete = async (user: any) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(user._id || user.id).unwrap();
                Swal.fire(
                    'Deleted!',
                    'User has been deleted.',
                    'success'
                );
            } catch (err: any) {
                console.error("Delete error", err);
                Swal.fire(
                    'Error!',
                    err?.data?.message || 'Failed to delete user.',
                    'error'
                );
            }
        }
    };

    const handleQuickStatusUpdate = async (userId: string, newStatus: string) => {
        try {
            toast.promise(
                updateUser({ id: userId, data: { status: newStatus } }).unwrap(),
                {
                    loading: 'Updating status...',
                    success: `Status updated to ${newStatus}`,
                    error: 'Failed to update status',
                }
            );
        } catch (err) {
            console.error("Status update error", err);
        }
    }

    // Define Columns
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "User",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={row.original.avatar} alt={row.original.name} />
                        <AvatarFallback>{row.original.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.email}</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "roles",
            header: "Roles",
            cell: ({ row }) => {
                const legacyRoles = row.original.roles || [];
                // Extract roles from Business Access (New Model)
                const permissionRoles = row.original.businessAccess?.map((acc: any) => acc.role) || [];

                // Combine and deduplicate by ID
                const allRoles = [...legacyRoles, ...permissionRoles].filter((r, i, arr) =>
                    r && arr.findIndex(t => (t._id || t.id) === (r._id || r.id)) === i
                );

                return (
                    <div className="flex flex-wrap gap-1">
                        {allRoles.map((r: any, idx: number) => {
                            const roleName = typeof r === 'string' ? r : r.name;
                            return (
                                <Badge key={idx} variant="outline" className="text-xs font-normal">
                                    {roleName}
                                </Badge>
                            );
                        })}
                    </div>
                );
            }
        },
        // Show Business Unit / Scope column if Super Admin
        ...(isSuperAdmin ? [{
            accessorKey: "businessUnits",
            header: "Context (BUS/Outlet)",
            cell: ({ row }: any) => {
                const legacyBUs = row.original.businessUnits || [];
                // Use Business Access for Scope Context
                const accessList = row.original.businessAccess || [];


                return (
                    <div className="flex flex-col gap-1">
                        {/* Legacy BUs */}
                        {legacyBUs.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {legacyBUs.map((bu: any, idx: number) => (
                                    <Badge key={`legacy-${idx}`} variant="secondary" className="text-xs font-normal">
                                        {typeof bu === 'string' ? bu : bu.name}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Scoped Access (New Model) */}
                        {accessList.map((acc: any, idx: number) => {
                            let displayText = 'Unknown';

                            // Check Scope
                            if (acc.scope === 'GLOBAL') {
                                return (
                                    <Badge key={`acc-${idx}`} variant="outline" className="text-xs font-normal border-blue-200">
                                        Global
                                    </Badge>
                                );
                            }

                            // 1. Outlet Scope
                            if (acc.outlet) {
                                let outletName = (typeof acc.outlet === 'object' && acc.outlet.name) ? acc.outlet.name : 'Unknown Outlet';
                                let buName = 'Unknown BU';

                                if (acc.businessUnit) {
                                    buName = (typeof acc.businessUnit === 'object' && acc.businessUnit.name) ? acc.businessUnit.name : 'BU';
                                }

                                if (outletName === 'Unknown Outlet' && typeof acc.outlet === 'string') {
                                    const found = availableOutlets.find((o: any) => (o._id === acc.outlet || o.id === acc.outlet));
                                    if (found) outletName = found.name;
                                }

                                displayText = `${buName} > ${outletName}`;
                            }
                            // 2. Business Unit Scope
                            else if (acc.businessUnit) {
                                if (typeof acc.businessUnit === 'object' && acc.businessUnit.name) {
                                    displayText = acc.businessUnit.name;
                                } else if (typeof acc.businessUnit === 'string') {
                                    const found = availableBusinessUnits.find((b: any) => (b._id === acc.businessUnit || b.id === acc.businessUnit));
                                    displayText = found ? found.name : 'Unknown BU';
                                }
                            } else {
                                return null;
                            }

                            return (
                                <Badge key={`acc-${idx}`} variant="secondary" className="text-xs font-normal">
                                    {displayText}
                                </Badge>
                            );
                        })}
                    </div>
                )
            }
        }] : []),
        {
            accessorKey: "phone",
            header: "Contact",
            cell: ({ row }) => row.original.phone || "—",
        },
        {
            header: "Status",
            cell: ({ row }) => {
                const user = row.original;
                const isTargetSuperAdmin = user.roles?.some((r: any) => checkIsSuperAdmin(normalizeAuthString(typeof r === 'string' ? r : r.name)));

                const getStatusVariant = (status: string) => {
                    switch (status) {
                        case USER_STATUS.ACTIVE: return 'default';
                        case USER_STATUS.BLOCKED: return 'destructive';
                        case USER_STATUS.SUSPENDED: return 'destructive';
                        case USER_STATUS.PENDING: return 'outline';
                        default: return 'secondary';
                    }
                };

                if (isTargetSuperAdmin || !hasPermission(PERMISSION_KEYS.USER.UPDATE)) {
                    return (
                        <Badge variant={getStatusVariant(user.status)}>
                            {user.status || "Pending"}
                        </Badge>
                    )
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="cursor-pointer hover:opacity-80">
                                <Badge variant={getStatusVariant(user.status)}>
                                    {user.status || "Pending"}
                                </Badge>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            {Object.values(USER_STATUS).map((status) => (
                                <DropdownMenuItem
                                    key={status}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent row expand
                                        handleQuickStatusUpdate(user._id || user.id, status)
                                    }}
                                    disabled={user.status === status}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const isTargetSuperAdmin = row.original.roles?.some((r: any) => checkIsSuperAdmin(normalizeAuthString(typeof r === 'string' ? r : r.name)));

                if (isTargetSuperAdmin) {
                    return <div className="w-8" />; // Empty placeholder
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {/* 
                              Note: Route parsing logic might need adjustment if centralized. 
                              Use checks to construct path properly.
                            */}
                            {hasPermission(PERMISSION_KEYS.USER.READ) && (
                                <DropdownMenuItem onClick={() => {
                                    // Navigate to user profile
                                    if (isSuperAdmin) {
                                        router.push(`/global/user-management/users/${row.original._id || row.original.id}`)
                                    } else if (params["business-unit"]) {
                                        router.push(`/${params["business-unit"]}/user-management/users/${row.original._id || row.original.id}`)
                                    }
                                }}>
                                    <User className="mr-2 h-4 w-4" /> View Profile
                                </DropdownMenuItem>
                            )}
                            {hasPermission(PERMISSION_KEYS.USER.UPDATE) && (
                                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Role/Status
                                </DropdownMenuItem>
                            )}
                            {hasPermission(PERMISSION_KEYS.USER.DELETE) && (
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.original)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];

    return (
        <>
            <DataPageLayout
                title="All Users"
                description="View and manage all user accounts across the system."
                createAction={hasPermission(PERMISSION_KEYS.USER.CREATE) || hasPermission(PERMISSION_KEYS.STAFF.CREATE) ? {
                    label: "Add User",
                    onClick: handleCreate
                } : undefined}
                stats={
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Users"
                            value={users.length}
                            icon={Users}
                        />
                        <StatCard
                            title="Active Staff"
                            value={users.filter((u: any) => u.status === USER_STATUS.ACTIVE && u.roles?.some((r: any) => matchesRole(normalizeAuthString(typeof r === 'string' ? r : r.name), [USER_ROLES.SUPER_ADMIN, USER_ROLES.COMPANY_OWNER, USER_ROLES.ADMIN, USER_ROLES.SALES_ASSOCIATE]))).length}
                            icon={ShieldCheck}
                        />
                        <StatCard
                            title="Active Customers"
                            value={users.filter((u: any) => u.status === USER_STATUS.ACTIVE && u.roles?.some((r: any) => normalizeAuthString(typeof r === 'string' ? r : r.name) === USER_ROLES.CUSTOMER)).length}
                            icon={User}
                        />
                        <StatCard
                            title="New (Pending)"
                            value={users.filter((u: any) => u.status === USER_STATUS.PENDING).length}
                            icon={CheckCircle}
                        />
                    </div>
                }
                tabs={[
                    { value: "all", label: "All Users" },
                    { value: "staff", label: "Staff" },
                    { value: "customer", label: "Customers" },
                    { value: "supplier", label: "Suppliers" },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                extraFilters={
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {isSuperAdmin && (
                            <div className="w-[200px]">
                                <Select value={filterBU} onValueChange={setFilterBU}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="All Business Units" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Business Units</SelectItem>
                                        {availableBusinessUnits.map((bu: any) => (
                                            <SelectItem key={bu.id || bu._id} value={bu.id || bu._id}>{bu.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => refetchUsers()}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => console.log('Export')}>
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredData}
                    isLoading={isLoadingUsers}
                    renderSubComponent={(row) => {
                        const user = row.original;

                        // 1. Gather all role assignments (Global + Scoped)
                        const assignments: any[] = [];

                        // A. Global Roles
                        if (user.roles && user.roles.length > 0) {
                            user.roles.forEach((r: any) => {
                                const rId = typeof r === 'string' ? r : (r._id || r.id);
                                const rName = (typeof r === 'object' && r.name) ? r.name : 'Unknown';
                                assignments.push({
                                    roleId: rId,
                                    roleName: rName,
                                    scopeType: 'GLOBAL',
                                    scopeName: 'Global System',
                                    scopeVariant: 'outline'
                                });
                            });
                        }

                        // B. Scoped Roles (Business Access)
                        if (user.businessAccess && user.businessAccess.length > 0) {
                            user.businessAccess.forEach((acc: any) => {
                                let scopeName = 'Unknown Scope';
                                let scopeVariant = 'secondary';
                                let scopeType = acc.scope;

                                // Resolve Scope Name
                                if (acc.scope === 'GLOBAL') {
                                    scopeName = 'Global System';
                                    scopeVariant = 'outline';
                                } else if (acc.outlet) {
                                    scopeVariant = 'secondary';
                                    let outletName = (typeof acc.outlet === 'object' && acc.outlet.name) ? acc.outlet.name : null;
                                    let buName = (typeof acc.businessUnit === 'object' && acc.businessUnit.name) ? acc.businessUnit.name : 'Unknown BU';

                                    if (!outletName && typeof acc.outlet === 'string') {
                                        const found = availableOutlets.find((o: any) => o.id === acc.outlet || o._id === acc.outlet);
                                        if (found) outletName = found.name;
                                    }
                                    scopeName = `${buName} > ${outletName || 'Outlet'}`;
                                } else if (acc.businessUnit) {
                                    scopeVariant = 'default'; // Primary/Business
                                    if (typeof acc.businessUnit === 'object' && acc.businessUnit.name) {
                                        scopeName = acc.businessUnit.name;
                                    } else {
                                        const found = availableBusinessUnits.find((b: any) => b.id === acc.businessUnit || b._id === acc.businessUnit);
                                        scopeName = found ? found.name : 'Business Unit';
                                    }
                                }

                                const rId = typeof acc.role === 'string' ? acc.role : (acc.role?._id || acc.role?.id);
                                const rName = (typeof acc.role === 'object' && acc.role.name) ? acc.role.name : 'Unknown Role';

                                assignments.push({
                                    roleId: rId,
                                    roleName: rName,
                                    scopeType,
                                    scopeName,
                                    scopeVariant
                                });
                            });
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-muted/30 rounded-lg">
                                {/* Personal & Security Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                                            <User className="mr-2 h-4 w-4" /> Personal Information
                                        </h4>
                                        <div className="bg-card rounded-md border p-3 space-y-2 text-sm">
                                            <div className="grid grid-cols-[100px_1fr] gap-1">
                                                <span className="text-muted-foreground">Full Name:</span>
                                                <span className="font-medium">{user.name}</span>

                                                <span className="text-muted-foreground">Email:</span>
                                                <span className="flex items-center gap-1">
                                                    {user.email}
                                                    {user.isEmailVerified ?
                                                        <Check className="h-3 w-3 text-green-500" /> :
                                                        <X className="h-3 w-3 text-red-500" />
                                                    }
                                                </span>

                                                <span className="text-muted-foreground">Phone:</span>
                                                <span className="flex items-center gap-1">
                                                    {user.phone || 'N/A'}
                                                    {user.phone && (user.isPhoneVerified ?
                                                        <Check className="h-3 w-3 text-green-500" /> :
                                                        <X className="h-3 w-3 text-red-500" />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                                            <ShieldCheck className="mr-2 h-4 w-4" /> Security
                                        </h4>
                                        <div className="bg-card rounded-md border p-3 space-y-2 text-sm">
                                            <div className="grid grid-cols-[120px_1fr] gap-1">
                                                <span className="text-muted-foreground">Status:</span>
                                                <Badge variant={user.status === USER_STATUS.ACTIVE ? 'default' : 'secondary'} className="w-fit h-5 text-[10px]">
                                                    {user.status}
                                                </Badge>

                                                <span className="text-muted-foreground">Password Change:</span>
                                                <span>{user.needsPasswordChange ? "Required" : "Not Required"}</span>

                                                <span className="text-muted-foreground">Last Login:</span>
                                                <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>

                                                <span className="text-muted-foreground">Joined:</span>
                                                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Access & Roles (Expanded) */}
                                <div className="space-y-4 col-span-1 md:col-span-2">
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                                            <Layers className="mr-2 h-4 w-4" /> Access & Permissions
                                        </h4>
                                        <div className="bg-card rounded-md border p-3 space-y-3 text-sm max-h-[400px] overflow-y-auto">
                                            {assignments.length > 0 ? (
                                                <div className="space-y-4">
                                                    {assignments.map((assign: any, idx: number) => {
                                                        // Resolve Full Role Details from 'availableRoles' to get Permissions
                                                        const fullRole = availableRoles.find((r: any) => (r._id === assign.roleId || r.id === assign.roleId));

                                                        // Gather Permission Groups Names
                                                        const groups = fullRole?.permissionGroups?.map((g: any) => typeof g === 'string' ? g : g.name) || [];
                                                        // Gather Raw Permissions count
                                                        const permCount = fullRole?.permissions?.length || 0;

                                                        return (
                                                            <div key={idx} className="flex flex-col gap-2 p-3 bg-muted/40 rounded-md border hover:bg-muted/60 transition-colors">
                                                                {/* Header: Role & Scope */}
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-bold text-md">{assign.roleName || fullRole?.name || 'Unknown Role'}</span>
                                                                            {fullRole?.isSystemRole && <Badge variant="secondary" className="text-[10px] h-4">System</Badge>}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                            <MapPin className="h-3 w-3" />
                                                                            <span>{assign.scopeName}</span>
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant={assign.scopeVariant as any} className="uppercase">{assign.scopeType || 'Unknown'}</Badge>
                                                                </div>

                                                                {/* Body: Permissions/Groups */}
                                                                <div className="mt-2 border-t pt-2">
                                                                    <div className="flex flex-col gap-2">
                                                                        {/* 1. Permission Groups (High Level) */}
                                                                        {groups.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1 mb-1">
                                                                                <span className="text-[10px] text-muted-foreground mr-1 font-semibold">Groups:</span>
                                                                                {groups.map((g: string, gIdx: number) => (
                                                                                    <Badge key={gIdx} variant="secondary" className="text-[10px] h-4">
                                                                                        {g}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        {/* 2. Granular Permissions (Resource: Action) */}
                                                                        {fullRole?.permissions && fullRole.permissions.length > 0 ? (
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {fullRole.permissions.map((p: any, pIdx: number) => {
                                                                                    const label = (typeof p === 'object' && p.resource && p.action)
                                                                                        ? `${p.resource}:${p.action}`
                                                                                        : (typeof p === 'string' ? p : 'Unknown Perm');

                                                                                    return (
                                                                                        <Badge key={pIdx} variant="outline" className="text-[10px] bg-background font-mono">
                                                                                            {label}
                                                                                        </Badge>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {groups.length === 0 && `No detailed permissions found (Raw count: ${permCount})`}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-muted-foreground italic text-xs p-4 text-center">No role assignments found.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                />
            </DataPageLayout>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={editingUser ? "Edit User" : "Add New User"}
                description={editingUser ? "Edit user details and roles." : "Create a new user account."}
                fields={[
                    {
                        name: "firstName",
                        label: "First Name",
                        type: "text",
                        required: true,
                        placeholder: "John",
                        disabled: !!editingUser
                    },
                    {
                        name: "lastName",
                        label: "Last Name",
                        type: "text",
                        placeholder: "Doe",
                        disabled: !!editingUser
                    },
                    {
                        name: "email",
                        label: "Email",
                        type: "email",
                        required: true,
                        placeholder: "email@example.com",
                        disabled: !!editingUser
                    },
                    {
                        name: "phone",
                        label: "Phone",
                        type: "text",
                        placeholder: "Phone number",
                        disabled: !!editingUser
                    },
                    !editingUser && {
                        name: "password",
                        label: "Password",
                        type: "text",
                        placeholder: "Default: default123",
                    },
                    {
                        name: "role",
                        label: "Role",
                        type: "select",
                        required: true,
                        options: availableRoles.map((r: any) => ({ label: r.name, value: r._id || r.id })),
                        placeholder: "Select Role"
                    },
                    // Show Business Unit dropdown if Super Admin and NOT editing (or allows editing if needed, but keeping simple for now)
                    (isSuperAdmin && !editingUser && viewScope !== 'platform') && {
                        name: "businessUnit",
                        label: "Business Unit",
                        type: "select",
                        required: true,
                        options: availableBusinessUnits.map((bu: any) => ({ label: bu.name, value: bu.id })),
                        placeholder: "Select Business Unit",
                    },
                    // Optional Outlet Selection (Dependent on BU)
                    (!editingUser && viewScope !== 'platform') && {
                        name: "outlet",
                        label: "Outlet (Optional)",
                        type: "select",
                        required: false,
                        description: "Leave empty to give access to all outlets in the Business Unit",
                        options: availableOutlets
                            .filter((o: any) => {
                                // Filter outlets based on selected BU (needs form state access or assumption)
                                // AutoFormModal doesn't easily expose live state to schema builder function directly without re-render.
                                // Simplification: Show ALL outlets, but ideally should filter if BU selected.
                                // For now, listing all outlets is risky if lists overlap ID.
                                // Better approach: If we can't easily filter dynamically inside this specific component structure without refactor,
                                // we will show all outlets but maybe prefix with BU name?
                                // OR relies on user picking right one.
                                // Let's try to filter if we can access the 'defaultValues' logic or if we assume manual selection.
                                return true;
                            })
                            .map((o: any) => ({ label: `${o.name} (${o.businessUnit?.name || 'Unknown BU'})`, value: o.id })),
                        placeholder: "Select Outlet (Specific Access)"
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        required: true,
                        options: Object.values(USER_STATUS).map(s => ({ label: s.toUpperCase(), value: s })),
                        defaultValue: "active"
                    }
                ].filter(Boolean) as any}
                defaultValues={editingUser ? {
                    firstName: typeof editingUser.name === 'string' ? editingUser.name.split(' ')[0] : editingUser.name?.firstName,
                    lastName: typeof editingUser.name === 'string' ? editingUser.name.split(' ')[1] : editingUser.name?.lastName,
                    email: editingUser.email,
                    phone: editingUser.phone,
                    role: editingUser.roles?.[0]?._id || editingUser.roles?.[0]?.id || (typeof editingUser.roles?.[0] === 'string' ? editingUser.roles?.[0] : ''),
                    status: editingUser.status
                } : { status: "active" }}
                onSubmit={handleSubmit}
                submitLabel={editingUser ? "Update User" : "Create User"}
            />
        </>
    )
}
