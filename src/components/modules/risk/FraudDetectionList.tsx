"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldAlert, Search, CheckCircle, AlertTriangle } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { useCheckFraudMutation } from "@/redux/api/risk/riskApi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function FraudDetectionList() {
    const { hasPermission } = usePermissions();
    const [checkFraud, { isLoading }] = useCheckFraudMutation();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [result, setResult] = useState<any>(null);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await checkFraud({ phone: phoneNumber }).unwrap();
            setResult(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!hasPermission(PERMISSION_KEYS.FRAUD_DETECTION.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to check fraud status.</div>
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        Fake Order Detection
                    </CardTitle>
                    <CardDescription>Enter a customer phone number to check their risk status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCheck} className="flex gap-4 items-end">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="017xxxxxxxx"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !phoneNumber}>
                            {isLoading ? "Checking..." : "Check Risk"}
                            {!isLoading && <Search className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {result && (
                <Card className={`border-l-4 ${result.riskScore > 50 ? 'border-l-red-500' : 'border-l-green-500'}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {result.riskScore > 50 ? (
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            ) : (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            )}
                            Risk Score: {result.riskScore}
                        </CardTitle>
                        <CardDescription>
                            Status: <span className="font-semibold uppercase">{result.status}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {result.matches && result.matches.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-medium">Blacklist Matches:</h4>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {result.matches.map((m: any, i: number) => (
                                        <li key={i}>{m.reason} ({m.type}: {m.identifier})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {result.riskScore === 0 && (
                            <p className="text-green-600">No risk factors detected for this customer.</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

