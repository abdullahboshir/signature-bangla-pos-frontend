"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DollarSign, Percent, Calendar, Lock, Plus, Trash2, Building } from "lucide-react"

interface BankAccount {
    bankName: string
    accountNumber: string
    accountName: string
    accountType: "savings" | "current" | "corporate"
    branch?: string
    routingNumber?: string
    swiftCode?: string
    isPrimary?: boolean
}

interface FinancialCoreData {
    baseCurrency?: string
    accountingMethod?: "cash" | "accrual"
    fiscalYearStartMonth?: number
    defaultPaymentTermsDays?: number
    financialLockDate?: string
    autoSyncExchangeRates?: boolean
    allowBackdatedTransactions?: boolean
    bankAccounts?: BankAccount[]
    fiscalPeriods?: Array<{
        periodName: string
        startDate: string
        endDate: string
        isClosed: boolean
    }>
}

interface FinancialCoreSettingsProps {
    data: FinancialCoreData
    onChange: (section: string, ...args: any[]) => void
}

const MONTHS = [
    { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
    { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
    { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
]

export default function FinancialCoreSettings({ data, onChange }: FinancialCoreSettingsProps) {
    const handleAddAccount = () => {
        const newAccounts = [...(data.bankAccounts || []), {
            bankName: "",
            accountNumber: "",
            accountName: "",
            accountType: "current" as const,
            isPrimary: (data.bankAccounts || []).length === 0
        }]
        onChange("financialCore", "bankAccounts", newAccounts)
    }

    const handleRemoveAccount = (index: number) => {
        const newAccounts = (data.bankAccounts || []).filter((_, i) => i !== index)
        onChange("financialCore", "bankAccounts", newAccounts)
    }

    const handleAccountChange = (index: number, field: keyof BankAccount, value: any) => {
        const newAccounts = [...(data.bankAccounts || [])]
        newAccounts[index] = { ...newAccounts[index], [field]: value }

        // Ensure only one primary account
        if (field === "isPrimary" && value === true) {
            newAccounts.forEach((acc, i) => {
                if (i !== index) acc.isPrimary = false
            })
        }

        onChange("financialCore", "bankAccounts", newAccounts)
    }

    const handleAddPeriod = () => {
        const newPeriods = [...(data.fiscalPeriods || []), {
            periodName: "",
            startDate: "",
            endDate: "",
            isClosed: false
        }]
        onChange("fiscalPeriods", newPeriods)
    }

    const handleRemovePeriod = (index: number) => {
        const newPeriods = (data.fiscalPeriods || []).filter((_, i) => i !== index)
        onChange("fiscalPeriods", newPeriods)
    }

    const handlePeriodChange = (index: number, field: string, value: any) => {
        const newPeriods = [...(data.fiscalPeriods || [])]
        newPeriods[index] = { ...newPeriods[index], [field]: value }
        onChange("fiscalPeriods", newPeriods)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                        Financial Core Configuration
                    </CardTitle>
                    <CardDescription>
                        Define your base currency, accounting methods, and fiscal year settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Base Currency</Label>
                            <Input
                                value={data.baseCurrency || "BDT"}
                                onChange={(e) => onChange("financialCore", "baseCurrency", e.target.value)}
                                placeholder="e.g. BDT, USD"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Accounting Method</Label>
                            <Select
                                value={data.accountingMethod || "accrual"}
                                onValueChange={(val) => onChange("financialCore", "accountingMethod", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="accrual">Accrual Basis</SelectItem>
                                    <SelectItem value="cash">Cash Basis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fiscal Year Start Month</Label>
                            <Select
                                value={data.fiscalYearStartMonth?.toString() || "1"}
                                onValueChange={(val) => onChange("financialCore", "fiscalYearStartMonth", parseInt(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map(m => (
                                        <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Default Payment Terms (Days)</Label>
                            <Input
                                type="number"
                                value={data.defaultPaymentTermsDays || 30}
                                onChange={(e) => onChange("financialCore", "defaultPaymentTermsDays", parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Exchange Rates Auto-Sync</Label>
                                <p className="text-sm text-muted-foreground">Automatically update currency exchange rates daily</p>
                            </div>
                            <Switch
                                checked={data.autoSyncExchangeRates ?? true}
                                onCheckedChange={(val) => onChange("financialCore", "autoSyncExchangeRates", val)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Allow Backdated Transactions</Label>
                                <p className="text-sm text-muted-foreground">Permit entries with dates in the past</p>
                            </div>
                            <Switch
                                checked={data.allowBackdatedTransactions ?? false}
                                onCheckedChange={(val) => onChange("financialCore", "allowBackdatedTransactions", val)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-orange-500" />
                            Financial Lock Date
                        </Label>
                        <Input
                            type="date"
                            value={data.financialLockDate || ""}
                            onChange={(e) => onChange("financialCore", "financialLockDate", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">No transactions can be edited or added before this date.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-blue-500" />
                            Bank Accounts
                        </CardTitle>
                        <CardDescription>Manage organization bank accounts for payments and settlements.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddAccount}>
                        <Plus className="h-4 w-4 mr-2" /> Add Bank
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(!data.bankAccounts || data.bankAccounts.length === 0) ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                            No bank accounts added yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.bankAccounts.map((account, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-4 relative bg-muted/30">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-destructive"
                                        onClick={() => handleRemoveAccount(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Bank Name</Label>
                                            <Input
                                                value={account.bankName}
                                                onChange={(e) => handleAccountChange(index, "bankName", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Account Name</Label>
                                            <Input
                                                value={account.accountName}
                                                onChange={(e) => handleAccountChange(index, "accountName", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Account Number</Label>
                                            <Input
                                                value={account.accountNumber}
                                                onChange={(e) => handleAccountChange(index, "accountNumber", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Account Type</Label>
                                            <Select
                                                value={account.accountType}
                                                onValueChange={(val) => handleAccountChange(index, "accountType", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="savings">Savings</SelectItem>
                                                    <SelectItem value="current">Current</SelectItem>
                                                    <SelectItem value="corporate">Corporate</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Branch Name</Label>
                                            <Input
                                                value={account.branch}
                                                onChange={(e) => handleAccountChange(index, "branch", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Routing Number</Label>
                                            <Input
                                                value={account.routingNumber}
                                                onChange={(e) => handleAccountChange(index, "routingNumber", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>SWIFT / BIC Code</Label>
                                            <Input
                                                value={account.swiftCode}
                                                onChange={(e) => handleAccountChange(index, "swiftCode", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id={`primary-${index}`}
                                            checked={account.isPrimary}
                                            onCheckedChange={(val) => handleAccountChange(index, "isPrimary", val)}
                                        />
                                        <Label htmlFor={`primary-${index}`}>Primary Settlement Account</Label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-orange-500" />
                            Fiscal Periods
                        </CardTitle>
                        <CardDescription>Define and manage accounting periods and closures.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddPeriod}>
                        <Plus className="h-4 w-4 mr-2" /> Add Period
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(!data.fiscalPeriods || data.fiscalPeriods.length === 0) ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                            No fiscal periods defined yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.fiscalPeriods.map((period, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-4 relative bg-muted/30">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-destructive"
                                        onClick={() => handleRemovePeriod(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Period Name (e.g. FY 2024)</Label>
                                            <Input
                                                value={period.periodName}
                                                onChange={(e) => handlePeriodChange(index, "periodName", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-8">
                                            <Switch
                                                checked={period.isClosed}
                                                onCheckedChange={(val) => handlePeriodChange(index, "isClosed", val)}
                                            />
                                            <Label>Period Closed?</Label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Date</Label>
                                            <Input
                                                type="date"
                                                value={period.startDate ? new Date(period.startDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => handlePeriodChange(index, "startDate", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Date</Label>
                                            <Input
                                                type="date"
                                                value={period.endDate ? new Date(period.endDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => handlePeriodChange(index, "endDate", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
