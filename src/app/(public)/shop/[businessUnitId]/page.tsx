import StorefrontPageClient from "./[...slug]/StorefrontPageClient";

export default async function ShopRootPage({ params }: { params: Promise<{ businessUnitId: string }> }) {
    const { businessUnitId } = await params;
    // Default to 'home' slug when visiting the root store URL
    return <StorefrontPageClient businessUnitId={businessUnitId} slug="home" />;
}
