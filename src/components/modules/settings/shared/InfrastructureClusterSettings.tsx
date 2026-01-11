"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Server } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InfrastructureClusterSettingsProps {
    data: any;
    onChange: (section: string, key: string, value: any) => void;
}

const InfrastructureClusterSettings: React.FC<InfrastructureClusterSettingsProps> = ({ data, onChange }) => {
    const infra = data?.infrastructureHub || {};

    const handleListChange = (key: string, value: string) => {
        const list = value.split(',').map(item => item.trim()).filter(Boolean);
        onChange('infrastructureHub', key, list);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Server className="w-5 h-5 text-purple-500" />
                        Infrastructure Cluster
                    </CardTitle>
                    <CardDescription>
                        Configure platform scalability and distributed architecture.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Enable Load Balancer</Label>
                            <p className="text-xs text-muted-foreground">Distribute traffic across multiple cluster nodes.</p>
                        </div>
                        <Switch
                            checked={infra.enableLoadBalancer || false}
                            onCheckedChange={(v) => onChange('infrastructureHub', 'enableLoadBalancer', v)}
                        />
                    </div>

                    {infra.enableLoadBalancer && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <Label>Load Balancer Type</Label>
                                <Select
                                    value={infra.lbType || "round-robin"}
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
                                    value={infra.clusterNodes?.join(', ') || ""}
                                    onChange={(e) => handleListChange('clusterNodes', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t space-y-2">
                        <Label>Cache Layer Driver</Label>
                        <Select
                            value={infra.cacheLayer?.driver || "internal"}
                            onValueChange={(v) => onChange('infrastructureHub', 'cacheLayer', { driver: v })}
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
        </div>
    );
};

export default InfrastructureClusterSettings;
