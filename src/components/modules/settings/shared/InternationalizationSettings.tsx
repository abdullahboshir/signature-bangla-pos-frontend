import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe, DollarSign, Clock } from 'lucide-react';

interface InternationalizationSettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

const InternationalizationSettings: React.FC<InternationalizationSettingsProps> = ({ data, onChange }) => {
    const hub = data?.internationalizationHub || {};

    const addLanguage = () => {
        const langs = [...(hub.supportedLanguages || [])];
        langs.push({ code: '', name: '', isDefault: false });
        onChange('internationalizationHub', 'supportedLanguages', langs);
    }

    const removeLanguage = (index: number) => {
        const langs = hub.supportedLanguages.filter((_: any, i: number) => i !== index);
        onChange('internationalizationHub', 'supportedLanguages', langs);
    }

    const updateLanguage = (index: number, key: string, val: any) => {
        const langs = [...hub.supportedLanguages];
        langs[index] = { ...langs[index], [key]: val };
        if (key === 'isDefault' && val === true) {
            langs.forEach((l, i) => { if (i !== index) l.isDefault = false; });
        }
        onChange('internationalizationHub', 'supportedLanguages', langs);
    }

    const addCurrency = () => {
        const currs = [...(hub.supportedCurrencies || [])];
        currs.push({ code: '', symbol: '', exchangeRateToUSD: 1, isDefault: false });
        onChange('internationalizationHub', 'supportedCurrencies', currs);
    }

    const removeCurrency = (index: number) => {
        const currs = hub.supportedCurrencies.filter((_: any, i: number) => i !== index);
        onChange('internationalizationHub', 'supportedCurrencies', currs);
    }

    const updateCurrency = (index: number, key: string, val: any) => {
        const currs = [...hub.supportedCurrencies];
        currs[index] = { ...currs[index], [key]: val };
        onChange('internationalizationHub', 'supportedCurrencies', currs);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Languages & Localization
                    </CardTitle>
                    <CardDescription>
                        Configure supported languages and regional formatting.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Number Format</Label>
                            <Select
                                value={hub.numberFormat || 'en-US'}
                                onValueChange={(v) => onChange('internationalizationHub', 'numberFormat', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en-US">US (1,234.56)</SelectItem>
                                    <SelectItem value="en-GB">UK (1,234.56)</SelectItem>
                                    <SelectItem value="de-DE">Germany (1.234,56)</SelectItem>
                                    <SelectItem value="bn-BD">Bangladesh (1,23,456.78)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone Preference</Label>
                            <Select
                                value={hub.defaultTimezone || 'UTC'}
                                onValueChange={(v) => onChange('internationalizationHub', 'defaultTimezone', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UTC">UTC (Universal)</SelectItem>
                                    <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                    <SelectItem value="Europe/London">Europe/London (BST)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label>Active Languages</Label>
                            <Button variant="outline" size="sm" onClick={addLanguage}>Add Language</Button>
                        </div>
                        <div className="space-y-2">
                            {hub.supportedLanguages?.map((lang: any, idx: number) => (
                                <div key={idx} className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-muted/30">
                                    <Input
                                        placeholder="Name (e.g. English)"
                                        className="w-32 h-8"
                                        value={lang.name}
                                        onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Code (en)"
                                        className="w-20 h-8"
                                        value={lang.code}
                                        onChange={(e) => updateLanguage(idx, 'code', e.target.value)}
                                    />
                                    <div className="flex items-center gap-2 ml-auto">
                                        <Label className="text-xs">Default</Label>
                                        <Switch
                                            checked={lang.isDefault}
                                            onCheckedChange={(v) => updateLanguage(idx, 'isDefault', v)}
                                        />
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => removeLanguage(idx)}>×</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                        Currencies & Valuation
                    </CardTitle>
                    <CardDescription>
                        Supported currencies and exchange rate logic.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Active Currencies</Label>
                        <Button variant="outline" size="sm" onClick={addCurrency}>Add Currency</Button>
                    </div>
                    <div className="space-y-2">
                        {hub.supportedCurrencies?.map((curr: any, idx: number) => (
                            <div key={idx} className="flex flex-wrap items-center gap-2 p-3 border rounded-lg">
                                <Input
                                    placeholder="Code (USD)"
                                    className="w-20"
                                    value={curr.code}
                                    onChange={(e) => updateCurrency(idx, 'code', e.target.value)}
                                />
                                <Input
                                    placeholder="Symbol ($)"
                                    className="w-16"
                                    value={curr.symbol}
                                    onChange={(e) => updateCurrency(idx, 'symbol', e.target.value)}
                                />
                                <div className="flex flex-col gap-1 flex-1">
                                    <Label className="text-[10px] text-muted-foreground">Exchange Rate (To USD)</Label>
                                    <Input
                                        type="number"
                                        className="h-8"
                                        value={curr.exchangeRateToUSD}
                                        onChange={(e) => updateCurrency(idx, 'exchangeRateToUSD', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    {curr.isDefault ? <Badge variant="outline">Base</Badge> : <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => removeCurrency(idx)}>×</Button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InternationalizationSettings;
