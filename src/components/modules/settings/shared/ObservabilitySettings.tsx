"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Activity, Database, Server, Terminal } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ObservabilitySettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

const ObservabilitySettings: React.FC<ObservabilitySettingsProps> = ({ data, onChange }) => {
    const obs = data?.observability || {};
    const health = obs.healthCheck || {};
    const perf = obs.performance || {};

    const handleListChange = (subsection: string, key: string, value: string) => {
        const list = value.split(',').map(item => item.trim()).filter(Boolean);
        onChange('observability', subsection, key, list);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Terminal className="w-5 h-5 text-amber-500" />
                        Logging & Error Tracking
                    </CardTitle>
                    <CardDescription>
                        Configure system logging and external error reporting.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Enable Sentry</Label>
                            <p className="text-xs text-muted-foreground">Catch and report runtime errors to Sentry cluster.</p>
                        </div>
                        <Switch
                            checked={obs.enableSentry}
                            onCheckedChange={(v) => onChange('observability', 'enableSentry', v)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Log Retention (Days)</Label>
                        <Input
                            type="number"
                            value={obs.logRetentionDays || 30}
                            onChange={(e) => onChange('observability', 'logRetentionDays', parseInt(e.target.value))}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Health Checks
                    </CardTitle>
                    <CardDescription>
                        Monitor system vitals and endpoint availability.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Enabled</Label>
                            <p className="text-xs text-muted-foreground">Enable active health monitoring for this cluster.</p>
                        </div>
                        <Switch
                            checked={health.enabled}
                            onCheckedChange={(v) => onChange('observability', 'healthCheck', 'enabled', v)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Interval (Seconds)</Label>
                            <Input
                                type="number"
                                value={health.intervalSeconds || 60}
                                onChange={(e) => onChange('observability', 'healthCheck', 'intervalSeconds', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Health Endpoints (Comma separated)</Label>
                            <Input
                                placeholder="/health, /status"
                                value={health.endpoints?.join(', ') || ''}
                                onChange={(e) => handleListChange('healthCheck', 'endpoints', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="w-5 h-5 text-blue-500" />
                        Performance Optimizations
                    </CardTitle>
                    <CardDescription>
                        Tune database and cache layer parameters.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>DB Pool Size</Label>
                            <Input
                                type="number"
                                value={perf.dbPoolSize || 10}
                                onChange={(e) => onChange('observability', 'performance', 'dbPoolSize', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Redis TTL (Seconds)</Label>
                            <Input
                                type="number"
                                value={perf.redisCacheTtlSeconds || 3600}
                                onChange={(e) => onChange('observability', 'performance', 'redisCacheTtlSeconds', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Enable Query Logging</Label>
                            <p className="text-xs text-muted-foreground">Log all database queries for debugging (High Overhead).</p>
                        </div>
                        <Switch
                            checked={perf.enableQueryLogging}
                            onCheckedChange={(v) => onChange('observability', 'performance', 'enableQueryLogging', v)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ObservabilitySettings;
