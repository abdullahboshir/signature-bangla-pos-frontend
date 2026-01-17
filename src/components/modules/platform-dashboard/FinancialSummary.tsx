import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, CreditCard, DollarSign } from "lucide-react";

export function FinancialSummary({ stats }: { stats: any }) {
    const totalSales = stats?.totalSales || stats?.revenue || "৳ 0.00";
    const totalExpense = stats?.totalExpense || stats?.expense || "৳ 0.00";
    
    return (
        <Card className="col-span-1 lg:col-span-4 h-full">
            <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Total Sales / Revenue
                        </div>
                        <div className="text-xl font-bold">{totalSales}</div>
                        <p className="text-xs text-muted-foreground">
                            Gross processed amount
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Total Expenses
                        </div>
                        <div className="text-xl font-bold">{totalExpense}</div>
                        <div className="flex items-center text-xs text-orange-500">
                            Operational costs
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Net Performance
                        </div>
                        <div className="text-xl font-bold">{stats?.net || "৳ 0.00"}</div>
                        <p className="text-xs text-green-500">
                            Final profit summary
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
