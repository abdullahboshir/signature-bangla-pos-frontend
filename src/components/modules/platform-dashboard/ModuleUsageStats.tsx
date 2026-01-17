
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ModuleUsageStats() {
    const data = [
        { name: 'POS', users: 1200 },
        { name: 'ERP', users: 800 },
        { name: 'HRM', users: 450 },
        { name: 'E-com', users: 950 },
        { name: 'CRM', users: 600 },
    ];

    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Module Adoption</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="users" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
