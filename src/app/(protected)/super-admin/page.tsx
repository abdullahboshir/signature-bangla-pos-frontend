"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth"
import { superAdminService } from "@/services/super-admin/superadmin.service";

export default function SuperAdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await superAdminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Use real business units from user profile
    const businessUnits = user?.businessUnits?.map((unit: any) => ({
        id: unit.id,
        name: unit.name,
        type: 'General', // TODO: Add type to backend model if needed
        stats: { sales: '0.00', orders: 0 }
    })) || [];

    const totalStats = {
        revenue: loading ? '...' : `BDT ${stats?.revenue?.total || 0}`,
        profit: 'BDT 0', // Placeholder
        sales: loading ? '...' : (stats?.sales?.total || 0),
        activeUnits: loading ? '...' : (stats?.businessUnits?.active || 0)
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Super Admin Overview</h1>
                <div className="text-sm text-gray-500">
                    Welcome back, {user?.name}
                </div>
            </div>

            {/* Aggregated Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalStats.revenue}</h3>
                    <span className="text-xs text-green-600 flex items-center mt-1">
                        +12.5% from last month
                    </span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Net Profit</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalStats.profit}</h3>
                    <span className="text-xs text-green-600 flex items-center mt-1">
                        +8.2% from last month
                    </span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Sales</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalStats.sales}</h3>
                    <span className="text-xs text-blue-600 flex items-center mt-1">
                        Across all units
                    </span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Active Business Units</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalStats.activeUnits}</h3>
                    <span className="text-xs text-purple-600 flex items-center mt-1">
                        All systems operational
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Business Units Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Business Units Performance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {businessUnits.length === 0 ? (
                            <p className="text-gray-500 italic">No business units assigned.</p>
                        ) : businessUnits.map((unit: any) => (
                            <a
                                key={unit.id}
                                href={`/super-admin/${unit.id}/overview`}
                                className="group block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{unit.name}</h3>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mt-1">{unit.type}</span>
                                    </div>
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2 border-t border-gray-50">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Today's Revenue</span>
                                        <span className="font-semibold text-gray-900">BDT 0.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Orders</span>
                                        <span className="font-semibold text-gray-900">0</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / System Health */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span>Add New User</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span>Global Reports</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span>System Settings</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
