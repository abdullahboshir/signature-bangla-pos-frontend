
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, CreditCard, DollarSign } from "lucide-react";

export function FinancialSummary() {
    return (
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pending Payouts
                        </div>
                        <div className="text-2xl font-bold">BDT 45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled for next Tuesday
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Total Processed (YTD)
                        </div>
                        <div className="text-2xl font-bold">BDT 2,345,000.00</div>
                        <div className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +20.1% from last year
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowDownRight className="mr-2 h-4 w-4" />
                            Refund Rate
                        </div>
                        <div className="text-2xl font-bold">1.2%</div>
                        <div className="flex items-center text-xs text-green-500">
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                            -0.4% from last month
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
