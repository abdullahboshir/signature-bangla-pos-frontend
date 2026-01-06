import AuditLogList from "@/components/modules/system/AuditLogList";
import PermissionHealthWidget from "@/components/modules/system/PermissionHealthWidget";

export default function AuditLogsPage() {
    return (
        <div className="p-4 space-y-6">
            <PermissionHealthWidget />
            <AuditLogList />
        </div>
    );
}
