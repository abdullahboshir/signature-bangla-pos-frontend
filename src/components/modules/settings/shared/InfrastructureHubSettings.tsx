import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Webhook, Database, Cpu, Lock, Server, Mail, HardDrive, History } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InfrastructureHubSettingsProps {
    data: any;
    onChange: (section: string, ...rest: any[]) => void;
}

const InfrastructureHubSettings: React.FC<InfrastructureHubSettingsProps> = ({ data, onChange }) => {
    // Handling multiple top-level keys in one technical hub
    const sso = data?.ssoHub || {};
    const webhooks = data?.webhookOrchestrator || {};
    const api = data?.apiDeveloperRegistry || {};
    // Handle both Platform (blueprint) and Organization (enforcement) naming
    const quota = data?.resourceQuotaBlueprint || data?.resourceQuotaEnforcement || {};
    const smtp = data?.smtp || {};
    const storage = data?.storageRegistry || {};
    const backup = data?.backupRegistry || {};
    const archival = data?.archivalPolicy || {};

    return (
        <div className="space-y-6">
            {/* SSO Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Lock className="w-5 h-5 text-blue-500" />
                        SSO & Identity Hub
                    </CardTitle>
                    <CardDescription>
                        Manage Single Sign-On providers and global mapping.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Enable SSO Hub</Label>
                            <p className="text-xs text-muted-foreground">Allow users to log in via external identity providers.</p>
                        </div>
                        <Switch
                            checked={sso.enabled}
                            onCheckedChange={(v) => onChange('ssoHub', 'enabled', v)}
                        />
                    </div>
                    {sso.enabled && (
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Provider</Label>
                                    <Select value={sso.provider} onValueChange={(v) => onChange('ssoHub', 'provider', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="oidc">OIDC (Generic)</SelectItem>
                                            <SelectItem value="okta">Okta</SelectItem>
                                            <SelectItem value="googl">Google Workspace</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Issuer URL</Label>
                                    <Input value={sso.issuerUrl} onChange={(e) => onChange('ssoHub', 'issuerUrl', e.target.value)} placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Client ID</Label>
                                    <Input value={sso.clientId} onChange={(e) => onChange('ssoHub', 'clientId', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Callback URL</Label>
                                    <Input value={sso.callbackUrl} onChange={(e) => onChange('ssoHub', 'callbackUrl', e.target.value)} placeholder="https://.../callback" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Email Mapping Field</Label>
                                    <Input value={sso.mapping?.emailField || "email"} onChange={(e) => onChange('ssoHub', 'mapping', 'emailField', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Role Mapping Field</Label>
                                    <Input value={sso.mapping?.roleField || "role"} onChange={(e) => onChange('ssoHub', 'mapping', 'roleField', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Webhook Orchestrator */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Webhook className="w-5 h-5 text-orange-500" />
                        Webhook Orchestrator
                    </CardTitle>
                    <CardDescription>
                        Configure global webhook delivery and retry policies.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <div className="space-y-4 border p-3 rounded-lg bg-muted/20 col-span-2">
                            <Label className="font-semibold">Retry Policy</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Max Retries</Label>
                                    <Input
                                        type="number"
                                        className="h-8"
                                        value={webhooks.retryPolicy?.maxRetries || 3}
                                        onChange={(e) => onChange('webhookOrchestrator', 'retryPolicy', 'maxRetries', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Initial Delay (ms)</Label>
                                    <Input
                                        type="number"
                                        className="h-8"
                                        value={webhooks.retryPolicy?.initialDelayMs || 1000}
                                        onChange={(e) => onChange('webhookOrchestrator', 'retryPolicy', 'initialDelayMs', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Backoff Multiplier</Label>
                                    <Input
                                        type="number"
                                        className="h-8"
                                        value={webhooks.retryPolicy?.backoffMultiplier || 2}
                                        onChange={(e) => onChange('webhookOrchestrator', 'retryPolicy', 'backoffMultiplier', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <Switch
                                        checked={webhooks.retryPolicy?.jitter || false}
                                        onCheckedChange={(v) => onChange('webhookOrchestrator', 'retryPolicy', 'jitter', v)}
                                    />
                                    <Label className="text-xs">Jitter</Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Delivery Mode</Label>
                            <Select value={webhooks.deliveryMode} onValueChange={(v) => onChange('webhookOrchestrator', 'deliveryMode', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="parallel">Parallel (Faster)</SelectItem>
                                    <SelectItem value="sequential">Sequential (Safer)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Signing Key</Label>
                            <Input value={webhooks.signingKey} onChange={(e) => onChange('webhookOrchestrator', 'signingKey', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Timeout (ms)</Label>
                            <Input type="number" value={webhooks.timeoutMs} onChange={(e) => onChange('webhookOrchestrator', 'timeoutMs', parseInt(e.target.value))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Developer Registry */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Cpu className="w-5 h-5 text-indigo-500" />
                        API Developer Registry
                    </CardTitle>
                    <CardDescription>
                        Control global API versioning and developer access.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Versioning Enabled</Label>
                            <p className="text-xs text-muted-foreground">Enforce strict API versioning in requests.</p>
                        </div>
                        <Switch
                            checked={api.versioningEnabled}
                            onCheckedChange={(v) => onChange('apiDeveloperRegistry', 'versioningEnabled', v)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Current Production Version</Label>
                            <Input value={api.currentVersion} onChange={(e) => onChange('apiDeveloperRegistry', 'currentVersion', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Deprecated Versions</Label>
                            <Input
                                placeholder="v1, v2..."
                                value={api.deprecatedVersions?.join(', ') || ""}
                                onChange={(e) => onChange('apiDeveloperRegistry', 'deprecatedVersions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Resource Quotas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="w-5 h-5 text-emerald-500" />
                        Resource Quota Blueprint
                    </CardTitle>
                    <CardDescription>
                        Default limitations for new companies and business units.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
                            <Label className="text-xs">Max Users</Label>
                            <Input type="number" className="h-8" value={quota.maxUsers} onChange={(e) => onChange('resourceQuotaEnforcement', 'maxUsers', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
                            <Label className="text-xs">Max Outlets</Label>
                            <Input type="number" className="h-8" value={quota.maxOutlets} onChange={(e) => onChange('resourceQuotaEnforcement', 'maxOutlets', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
                            <Label className="text-xs">Max Business Units</Label>
                            <Input type="number" className="h-8" value={quota.maxBusinessUnits} onChange={(e) => onChange('resourceQuotaEnforcement', 'maxBusinessUnits', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
                            <Label className="text-xs">Max Storage (GB)</Label>
                            <Input type="number" className="h-8" value={quota.maxStorageGB} onChange={(e) => onChange('resourceQuotaEnforcement', 'maxStorageGB', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
                            <Label className="text-xs">Monthly Trans.</Label>
                            <Input type="number" className="h-8" value={quota.maxMonthlyTransactions} onChange={(e) => onChange('resourceQuotaEnforcement', 'maxMonthlyTransactions', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
                            <Label className="text-xs">Monthly API Req.</Label>
                            <Input type="number" className="h-8" value={quota.maxApiRequestsPerMonth} onChange={(e) => onChange('resourceQuotaEnforcement', 'maxApiRequestsPerMonth', parseInt(e.target.value))} />
                        </div>
                    </div>
                    <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
                        <Label className="text-xs">Allowed Modules</Label>
                        <Input
                            placeholder="e.g. pos, erp, hrm"
                            className="h-8"
                            value={quota.allowedModules?.join(', ') || ""}
                            onChange={(e) => onChange('resourceQuotaEnforcement', 'allowedModules', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Allow Bursting</Label>
                            <p className="text-xs text-muted-foreground">Temporarily exceed limits during peak hours.</p>
                        </div>
                        <Switch
                            checked={quota.allowBursting}
                            onCheckedChange={(v) => onChange('resourceQuotaEnforcement', 'allowBursting', v)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* SMTP Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Mail className="w-5 h-5 text-red-500" />
                        Dedicated SMTP Hub
                    </CardTitle>
                    <CardDescription>
                        Configure tenant-specific email delivery (Overrides system defaults).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Host</Label>
                            <Input value={smtp.host} onChange={(e) => onChange('smtp', 'host', e.target.value)} placeholder="smtp.mailtrap.io" />
                        </div>
                        <div className="space-y-2">
                            <Label>Port</Label>
                            <Input type="number" value={smtp.port} onChange={(e) => onChange('smtp', 'port', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input value={smtp.user} onChange={(e) => onChange('smtp', 'user', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>From Name</Label>
                            <Input value={smtp.fromName} onChange={(e) => onChange('smtp', 'fromName', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>Secure SSL/TLS</Label>
                        <Switch checked={smtp.secure} onCheckedChange={(v) => onChange('smtp', 'secure', v)} />
                    </div>
                </CardContent>
            </Card>

            {/* Storage Registry */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HardDrive className="w-5 h-5 text-cyan-500" />
                        Storage Registry
                    </CardTitle>
                    <CardDescription>
                        Tenant-specific file storage and bucket allocation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Storage Driver</Label>
                            <Select value={storage.driver || "local"} onValueChange={(v) => onChange('storageRegistry', 'driver', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="local">Local Filesystem</SelectItem>
                                    <SelectItem value="s3">AWS S3</SelectItem>
                                    <SelectItem value="cloudinary">Cloudinary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Bucket / Folder Name</Label>
                            <Input value={storage.bucketName} onChange={(e) => onChange('storageRegistry', 'bucketName', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>Is Bucket Public?</Label>
                        <Switch checked={storage.isPublic} onCheckedChange={(v) => onChange('storageRegistry', 'isPublic', v)} />
                    </div>
                </CardContent>
            </Card>

            {/* Backup & Disaster Recovery */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <History className="w-5 h-5 text-rose-500" />
                        Disaster Recovery
                    </CardTitle>
                    <CardDescription>
                        Automated database and storage backup orchestration.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Backup Schedule</Label>
                            <Select value={backup.schedule || "daily"} onValueChange={(v) => onChange('backupRegistry', 'schedule', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily Snapshot</SelectItem>
                                    <SelectItem value="weekly">Weekly Archive</SelectItem>
                                    <SelectItem value="monthly">Monthly Cold Storage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Retention Count</Label>
                            <Input type="number" value={backup.retentionCount} onChange={(e) => onChange('backupRegistry', 'retentionCount', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Backup Storage Path</Label>
                            <Input value={backup.storagePath} onChange={(e) => onChange('backupRegistry', 'storagePath', e.target.value)} placeholder="/backups/tenant-1/" />
                        </div>
                        <div className="flex items-center justify-between pt-8">
                            <Label>Enable Encryption</Label>
                            <Switch checked={backup.encryptionEnabled} onCheckedChange={(v) => onChange('backupRegistry', 'encryptionEnabled', v)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Archival Policy */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="w-5 h-5 text-indigo-500" />
                        Data Archival & Purging
                    </CardTitle>
                    <CardDescription>
                        Move historical data to cold storage or purge after retention.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Enable Automated Archiving</Label>
                            <p className="text-xs text-muted-foreground">Move old records to cold storage automatically.</p>
                        </div>
                        <Switch
                            checked={archival.enabled}
                            onCheckedChange={(v) => onChange('archivalPolicy', 'enabled', v)}
                        />
                    </div>
                    {archival.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <Label>Archive After (Months)</Label>
                                <Input type="number" value={archival.archiveAfterMonths} onChange={(e) => onChange('archivalPolicy', 'archiveAfterMonths', parseInt(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Cold Storage Provider</Label>
                                <Input value={archival.coldStorageProvider} onChange={(e) => onChange('archivalPolicy', 'coldStorageProvider', e.target.value)} placeholder="e.g. Glacier, Azure Archive" />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <Switch checked={archival.compressionEnabled} onCheckedChange={(v) => onChange('archivalPolicy', 'compressionEnabled', v)} />
                                <Label className="text-xs">Enable Compression</Label>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <Switch checked={archival.deleteAfterArchive} onCheckedChange={(v) => onChange('archivalPolicy', 'deleteAfterArchive', v)} />
                                <Label className="text-xs">Delete From Primary DB After Archive</Label>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cluster & Caching (Only for System Context) */}
            {data?.infrastructureHub && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Server className="w-5 h-5 text-purple-500" />
                            Cluster & Caching
                        </CardTitle>
                        <CardDescription>
                            Configure platform scalability and distributed caching.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                            <div className="space-y-0.5">
                                <Label>Enable Load Balancer</Label>
                                <p className="text-xs text-muted-foreground">Distribute traffic across multiple cluster nodes.</p>
                            </div>
                            <Switch
                                checked={data?.infrastructureHub?.enableLoadBalancer || false}
                                onCheckedChange={(v) => onChange('infrastructureHub', 'enableLoadBalancer', v)}
                            />
                        </div>
                        {data?.infrastructureHub?.enableLoadBalancer && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label>LB Type</Label>
                                    <Select
                                        value={data?.infrastructureHub?.lbType || "round-robin"}
                                        onValueChange={(v) => onChange('infrastructureHub', 'lbType', v)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="round-robin">Round Robin</SelectItem>
                                            <SelectItem value="least-connections">Least Connections</SelectItem>
                                            <SelectItem value="ip-hash">IP Hash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cluster Nodes (Comma separated)</Label>
                                    <Input
                                        placeholder="node1.internal, node2.internal"
                                        value={data?.infrastructureHub?.clusterNodes?.join(', ') || ""}
                                        onChange={(e) => onChange('infrastructureHub', 'clusterNodes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="pt-4 border-t space-y-2">
                            <Label>Cache Layer Driver</Label>
                            <Select
                                value={data?.infrastructureHub?.cacheLayer?.driver || "internal"}
                                onValueChange={(v) => onChange('infrastructureHub', 'cacheLayer', 'driver', v)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internal">Internal (In-Memory)</SelectItem>
                                    <SelectItem value="redis">Redis (Distributed)</SelectItem>
                                    <SelectItem value="memcached">Memcached</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default InfrastructureHubSettings;
