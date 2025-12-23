"use client";

import { BlockRenderer } from "@/components/storefront/Renderer";
import { useGetStoreConfigQuery, useGetStorePageQuery } from "@/redux/api/storefrontApi";
import { Loader2 } from "lucide-react";

export default function StorefrontPageClient({ businessUnitId, slug }: { businessUnitId: string, slug: string }) {

    const { data: config, isLoading: configLoading } = useGetStoreConfigQuery(businessUnitId);
    const { data: page, isLoading: pageLoading, error } = useGetStorePageQuery({ businessUnitId, slug });

    if (configLoading || pageLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-500">Page Not Found</div>;
    }

    // Apply Global Theme (Basic Implementation)
    // In a real app, we might inject this into a CSS Variable provider
    const themeStyle = {
        '--primary': config?.data?.theme?.primaryColor || '#f85606',
    } as React.CSSProperties;

    // Debug Log
    console.log("StorefrontPageClient Page Data:", page);

    return (
        <div style={themeStyle} className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Navbar Placeholder - Should be a proper component */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-2xl text-[var(--primary)]">
                        {config?.data?.navbar?.logo ? (
                            <img src={config.data.navbar.logo} alt="Logo" className="h-10" />
                        ) : (
                            "Store Logo"
                        )}
                    </div>
                    {/* Nav Links */}
                    <nav className="hidden md:flex gap-6">
                        {config?.data?.navbar?.links?.map((link: any, idx: number) => (
                            <a key={idx} href={link.url} className="hover:text-[var(--primary)] font-medium">{link.label}</a>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <BlockRenderer blocks={page?.data?.blocks || []} />
            </main>

            {/* Footer Placeholder */}
            <footer className="bg-gray-900 text-white py-10 mt-10">
                <div className="container mx-auto px-4 text-center">
                    <p>{config?.data?.footer?.copyrightText || "© 2025 Powered by Signature Bangla"}</p>
                </div>
            </footer>
        </div>
    );
}
