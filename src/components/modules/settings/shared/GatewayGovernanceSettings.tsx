"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Globe, Zap, Filter } from 'lucide-react';

interface GatewayGovernanceSettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

const GatewayGovernanceSettings: React.FC<GatewayGovernanceSettingsProps> = ({ data, onChange }) => {
    const gateway = data?.gatewayGovernance || {};
    const rateLimit = gateway.rateLimiting || {};
    const cors = gateway.cors || {};
    const firewall = gateway.firewall || {};

    const handleListChange = (subsection: string, key: string, value: string) => {
        const list = value.split(',').map(item => item.trim()).filter(Boolean);
        onChange('gatewayGovernance', subsection, key, list);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        API Rate Limiting
                    </CardTitle>
                    <CardDescription>
                        Control request bursts and sustained traffic flows.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Burst Limit</Label>
                            <Input
                                type="number"
                                value={rateLimit.burst || 100}
                                onChange={(e) => onChange('gatewayGovernance', 'rateLimiting', 'burst', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Sustained Limit</Label>
                            <Input
                                type="number"
                                value={rateLimit.sustained || 1000}
                                onChange={(e) => onChange('gatewayGovernance', 'rateLimiting', 'sustained', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Window (ms)</Label>
                            <Input
                                type="number"
                                value={rateLimit.windowMs || 60000}
                                onChange={(e) => onChange('gatewayGovernance', 'rateLimiting', 'windowMs', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Globe className="w-5 h-5 text-blue-500" />
                        CORS Policy
                    </CardTitle>
                    <CardDescription>
                        Define cross-origin resource sharing rules.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Allowed Origins (Comma separated)</Label>
                        <Input
                            placeholder="*, https://example.com"
                            value={cors.allowedOrigins?.join(', ') || ''}
                            onChange={(e) => handleListChange('cors', 'allowedOrigins', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Allow Credentials</Label>
                            <p className="text-xs text-muted-foreground">Enable passing of cookies and headers across domains.</p>
                        </div>
                        <Switch
                            checked={cors.allowCredentials}
                            onCheckedChange={(v) => onChange('gatewayGovernance', 'cors', 'allowCredentials', v)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ShieldCheck className="w-5 h-5 text-red-500" />
                        Network Firewall
                    </CardTitle>
                    <CardDescription>
                        Advanced IP filtering and user-agent security.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>IP Whitelist (Comma separated)</Label>
                            <Input
                                placeholder="127.0.0.1, 192.168.1.0/24"
                                value={firewall.whitelistedIps?.join(', ') || ''}
                                onChange={(e) => handleListChange('firewall', 'whitelistedIps', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>IP Blacklist (Comma separated)</Label>
                            <Input
                                placeholder="8.8.8.8, 10.0.0.1"
                                value={firewall.blacklistedIps?.join(', ') || ''}
                                onChange={(e) => handleListChange('firewall', 'blacklistedIps', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                User-Agent Filtering
                            </Label>
                            <p className="text-xs text-muted-foreground">Block suspicious bots and crawlers based on headers.</p>
                        </div>
                        <Switch
                            checked={firewall.userAgentFiltering}
                            onCheckedChange={(v) => onChange('gatewayGovernance', 'firewall', 'userAgentFiltering', v)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GatewayGovernanceSettings;
