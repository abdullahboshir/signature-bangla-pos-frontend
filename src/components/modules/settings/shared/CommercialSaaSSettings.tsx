import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShoppingBag, Brain, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface CommercialSaaSSettingsProps {
    data: any;
    onChange: (section: string, subsection: string, key: string, value: any) => void;
}

const CommercialSaaSSettings: React.FC<CommercialSaaSSettingsProps> = ({ data, onChange }) => {
    const saas = data?.commercialSaaS || {};
    const sub = saas.subscription || {};
    const market = saas.marketPresence || {};
    const ai = saas.aiGovernance || {};

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="w-5 h-5 text-indigo-500" />
                        Subscription & Billing
                    </CardTitle>
                    <CardDescription>
                        Global SaaS subscription parameters and defaults.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Trial Period (Days)</Label>
                            <Input
                                type="number"
                                value={sub.trialPeriodDays || 14}
                                onChange={(e) => onChange('commercialSaaS', 'subscription', 'trialPeriodDays', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Default Tier</Label>
                            <Select
                                value={sub.defaultTier || 'free'}
                                onValueChange={(v) => onChange('commercialSaaS', 'subscription', 'defaultTier', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Auto-Renewal Enabled</Label>
                            <p className="text-xs text-muted-foreground">Automatically renew subscriptions by default.</p>
                        </div>
                        <Switch
                            checked={sub.enableAutoRenewal}
                            onCheckedChange={(v) => onChange('commercialSaaS', 'subscription', 'enableAutoRenewal', v)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-fuchsia-500" />
                        Marketplace & Presence
                    </CardTitle>
                    <CardDescription>
                        Configuration for the platform marketplace and domain features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Enable Marketplace</Label>
                            <p className="text-xs text-muted-foreground">Allow companies to publish to the global marketplace.</p>
                        </div>
                        <Switch
                            checked={market.enableMarketplace}
                            onCheckedChange={(v) => onChange('commercialSaaS', 'marketPresence', 'enableMarketplace', v)}
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Allow Custom Domains</Label>
                            <p className="text-xs text-muted-foreground">Enable companies to use their own top-level domains.</p>
                        </div>
                        <Switch
                            checked={market.allowCustomDomains}
                            onCheckedChange={(v) => onChange('commercialSaaS', 'marketPresence', 'allowCustomDomains', v)}
                        />
                    </div>

                    <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Global Feature Flags</Label>
                            <Button variant="outline" size="sm" onClick={() => {
                                const newFlags = { ...market.featureFlags, "NEW_FEATURE": false };
                                onChange('commercialSaaS', 'marketPresence', 'featureFlags', newFlags);
                            }}>Add Flag</Button>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(market.featureFlags || {}).map(([key, val]: [string, any]) => (
                                <div key={key} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
                                    <Input
                                        className="h-8 flex-1 font-mono text-xs"
                                        value={key}
                                        onChange={(e) => {
                                            const newFlags = { ...market.featureFlags };
                                            delete newFlags[key];
                                            newFlags[e.target.value] = val;
                                            onChange('commercialSaaS', 'marketPresence', 'featureFlags', newFlags);
                                        }}
                                    />
                                    <Switch
                                        checked={val}
                                        onCheckedChange={(v) => {
                                            const newFlags = { ...market.featureFlags, [key]: v };
                                            onChange('commercialSaaS', 'marketPresence', 'featureFlags', newFlags);
                                        }}
                                    />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => {
                                        const newFlags = { ...market.featureFlags };
                                        delete newFlags[key];
                                        onChange('commercialSaaS', 'marketPresence', 'featureFlags', newFlags);
                                    }}>×</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="w-5 h-5 text-blue-500" />
                        AI Governance
                    </CardTitle>
                    <CardDescription>
                        Configure global AI provider and safety sensitivity.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                        <div className="space-y-0.5">
                            <Label>AI Features Enabled</Label>
                            <p className="text-xs text-muted-foreground">Globally toggle AI-driven assistance and insights.</p>
                        </div>
                        <Switch
                            checked={ai.enabled}
                            onCheckedChange={(v) => onChange('commercialSaaS', 'aiGovernance', 'enabled', v)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Preferred AI Provider</Label>
                            <Select
                                value={ai.preferredProvider || 'openai'}
                                onValueChange={(v) => onChange('commercialSaaS', 'aiGovernance', 'preferredProvider', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                                    <SelectItem value="anthropic">Anthropic (Claude 3.5)</SelectItem>
                                    <SelectItem value="google">Google (Gemini 1.5 Pro)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Sensitivity Level</Label>
                            <Select
                                value={ai.sensitivity || 'medium'}
                                onValueChange={(v) => onChange('commercialSaaS', 'aiGovernance', 'sensitivity', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low (Maximum Freedom)</SelectItem>
                                    <SelectItem value="medium">Medium (Standard)</SelectItem>
                                    <SelectItem value="high">High (Strict Safety)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CommercialSaaSSettings;
