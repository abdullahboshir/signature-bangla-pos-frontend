import React from 'react';

import { Sidebar } from "@/components/layouts/sidebar/Sidebar";

interface BusinessUnitLayoutProps {
    children: React.ReactNode;
    params: {
        businessUnitId: string;
    };
}

export default function BusinessUnitLayout({ children, params }: BusinessUnitLayoutProps) {
    // TODO: Fetch business unit details using params.businessUnitId and set in context/state

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">
                {children}
            </main>
        </div>
    );
}
