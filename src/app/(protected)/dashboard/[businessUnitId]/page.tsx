import React from 'react';

interface PageProps {
    params: {
        businessUnitId: string;
    };
}

export default function BusinessUnitDashboard({ params }: PageProps) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Business Unit Dashboard</h1>
            <p className="text-gray-600 mb-4">Unit ID: {params.businessUnitId}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-700">Today's Sales</h3>
                    <p className="text-2xl font-bold text-blue-600">BDT 0.00</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-700">Orders</h3>
                    <p className="text-2xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-700">Low Stock</h3>
                    <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-700">Profit</h3>
                    <p className="text-2xl font-bold text-purple-600">BDT 0.00</p>
                </div>
            </div>
        </div>
    );
}
