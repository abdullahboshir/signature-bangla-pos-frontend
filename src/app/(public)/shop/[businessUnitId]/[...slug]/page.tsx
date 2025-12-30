import { BlockRenderer } from "@/components/storefront/Renderer";
import StorefrontPageClient from "./StorefrontPageClient";
// import { useGetStoreConfigQuery, useGetStorePageQuery } from "@/redux/api/storefront/storefrontApi";
// Note: We cannot use hooks directly in server component if we want SSR, but assuming client-side fetching for now for simplicity in this dashboard app context.
// Actually, let's make it a client component wrapper.



export default async function StorefrontPage({ params }: { params: Promise<{ businessUnitId: string, slug?: string[] }> }) {
    const { businessUnitId, slug } = await params;
    // Slug is an array in catch-all routes
    const pageSlug = slug ? slug.join('/') : 'home';

    return <StorefrontPageClient businessUnitId={businessUnitId} slug={pageSlug} />;
}
