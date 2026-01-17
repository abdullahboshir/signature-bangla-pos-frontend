import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpdateOrganizationTenantConfigMutation } from "@/redux/api/platform/organizationApi";
import { toast } from "sonner";
import { Database, HardDrive, Server } from "lucide-react";

interface TenantConfigFormProps {
    organizationId: string;
    initialConfig?: any;
    onSuccess?: () => void;
}

export function TenantConfigForm({ organizationId, initialConfig, onSuccess }: TenantConfigFormProps) {
    const [updateConfig, { isLoading }] = useUpdateOrganizationTenantConfigMutation();
    const [formData, setFormData] = useState({
        deploymentType: initialConfig?.deploymentType || 'shared',
        customDomain: initialConfig?.customDomain || '',
        databaseUri: initialConfig?.databaseUri || '',
        isProvisioned: initialConfig?.isProvisioned || false,
        storageConfig: {
            provider: initialConfig?.storageConfig?.provider || 'cloudinary',
            cloudName: initialConfig?.storageConfig?.cloudName || '',
            apiKey: initialConfig?.storageConfig?.apiKey || '',
            apiSecret: initialConfig?.storageConfig?.apiSecret || '',
            bucket: initialConfig?.storageConfig?.bucket || '',
            region: initialConfig?.storageConfig?.region || '',
            accessKeyId: initialConfig?.storageConfig?.accessKeyId || '',
            secretAccessKey: initialConfig?.storageConfig?.secretAccessKey || '',
            cdnUrl: initialConfig?.storageConfig?.cdnUrl || '',
            basePath: initialConfig?.storageConfig?.basePath || '',
        }
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleStorageChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            storageConfig: { ...prev.storageConfig, [field]: value }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateConfig({ id: organizationId, tenantConfig: formData }).unwrap();
            toast.success("Tenant configuration updated successfully");
            onSuccess?.();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update configuration");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-0.5">
                        <Label className="text-base">Deployment Type</Label>
                        <p className="text-sm text-muted-foreground">Select how this tenant is deployed</p>
                    </div>
                    <Select
                        value={formData.deploymentType}
                        onValueChange={(value) => handleChange('deploymentType', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="shared">Shared (SaaS)</SelectItem>
                            <SelectItem value="dedicated">Dedicated (Hybrid)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Custom Domain (Optional)</Label>
                    <Input
                        placeholder="e.g., pos.client.com"
                        value={formData.customDomain}
                        onChange={(e) => handleChange('customDomain', e.target.value)}
                    />
                </div>

                {formData.deploymentType === 'dedicated' && (
                    <div className="space-y-4 p-4 border rounded-lg border-blue-200 bg-blue-50/50">
                        <div className="flex items-center gap-2 text-blue-800 font-semibold border-b border-blue-200 pb-2">
                            <Database className="w-4 h-4" /> Dedicated Resources
                        </div>
                        
                        <div className="grid gap-2">
                            <Label>Database URI</Label>
                            <Input
                                type="password"
                                placeholder="mongodb+srv://..."
                                value={formData.databaseUri}
                                onChange={(e) => handleChange('databaseUri', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">This will be encrypted securely.</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <Label>Is Provisioned?</Label>
                            <Switch
                                checked={formData.isProvisioned}
                                onCheckedChange={(checked) => handleChange('isProvisioned', checked)}
                            />
                        </div>
                    </div>
                )}

                {formData.deploymentType === 'dedicated' && (
                     <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-2 font-semibold border-b pb-2">
                            <HardDrive className="w-4 h-4" /> Dedicated Storage
                        </div>

                        <div className="grid gap-2">
                            <Label>Storage Provider</Label>
                            <Select
                                value={formData.storageConfig.provider}
                                onValueChange={(value) => handleStorageChange('provider', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cloudinary">Cloudinary</SelectItem>
                                    <SelectItem value="s3">AWS S3</SelectItem>
                                    <SelectItem value="local">Local (Not Recommended)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.storageConfig.provider === 'cloudinary' && (
                             <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Cloud Name</Label>
                                    <Input
                                        value={formData.storageConfig.cloudName}
                                        onChange={(e) => handleStorageChange('cloudName', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>API Key</Label>
                                    <Input
                                        value={formData.storageConfig.apiKey}
                                        onChange={(e) => handleStorageChange('apiKey', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <Label>API Secret</Label>
                                    <Input
                                        type="password"
                                        value={formData.storageConfig.apiSecret}
                                        onChange={(e) => handleStorageChange('apiSecret', e.target.value)}
                                    />
                                </div>
                             </div>
                        )}

                        {formData.storageConfig.provider === 's3' && (
                             <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Bucket Name</Label>
                                    <Input
                                        value={formData.storageConfig.bucket}
                                        onChange={(e) => handleStorageChange('bucket', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Region</Label>
                                    <Input
                                        value={formData.storageConfig.region}
                                        onChange={(e) => handleStorageChange('region', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Access Key ID</Label>
                                    <Input
                                        value={formData.storageConfig.accessKeyId}
                                        onChange={(e) => handleStorageChange('accessKeyId', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Secret Access Key</Label>
                                    <Input
                                        type="password"
                                        value={formData.storageConfig.secretAccessKey}
                                        onChange={(e) => handleStorageChange('secretAccessKey', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <Label>CDN URL (Optional)</Label>
                                    <Input
                                        value={formData.storageConfig.cdnUrl}
                                        onChange={(e) => handleStorageChange('cdnUrl', e.target.value)}
                                    />
                                </div>
                             </div>
                        )}
                        
                        <div className="grid gap-2">
                            <Label>Base Path (Folder Prefix)</Label>
                            <Input
                                placeholder="e.g., org-123"
                                value={formData.storageConfig.basePath}
                                onChange={(e) => handleStorageChange('basePath', e.target.value)}
                            />
                        </div>
                     </div>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Configuration"}
                </Button>
            </div>
        </form>
    );
}
