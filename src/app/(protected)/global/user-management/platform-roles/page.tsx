'use client';

import { RolePermissionManagement } from '@/components/modules/user-management/RolePermissionManagement';

export default function PlatformRolesPage() {
    return (
        <RolePermissionManagement viewScope="platform" />
    );
}
