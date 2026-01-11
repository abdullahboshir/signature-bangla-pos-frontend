"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { HardDrive, Cloud, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StorageRegistrySettingsProps {
    data: any;
    onChange: (section: string, subsection: string, key: string, value: any) => void;
}

const StorageRegistrySettings: React.FC<StorageRegistrySettingsProps> = ({ data, onChange }) => {
    const storage = data?.storageRegistry || {};

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HardDrive className="w-5 h-5 text-indigo-500" />
                        Storage Registry
                    </CardTitle>
                    <CardDescription>
                        Configure default storage provider and bucket parameters.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Storage Provider</Label>
                            <Select
                                value={storage.provider || 'local'}
                                onValueChange={(v) => onChange('storageRegistry', '', 'provider', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="local">Local Filesystem</SelectItem>
                                    <SelectItem value="s3">Amazon S3</SelectItem>
                                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Bucket / Directory Name</Label>
                            <Input
                                placeholder="system-storage"
                                value={storage.bucketName || ''}
                                onChange={(e) => onChange('storageRegistry', '', 'bucketName', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Public Access
                            </Label>
                            <p className="text-xs text-muted-foreground">Make all uploaded files publicly accessible via Direct URL.</p>
                        </div>
                        <Switch
                            checked={storage.isPublic}
                            onCheckedChange={(v) => onChange('storageRegistry', '', 'isPublic', v)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StorageRegistrySettings;
