import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useParams } from "next/navigation";
import { useGetStoreProductsQuery } from "@/redux/api/storefront/storefrontApi";

// ============================================================================
// 1. HERO SLIDER
// ============================================================================
export const HeroSliderBlock = ({ data }: { data: any }) => {
    const slides = data?.slides || [];

    if (!slides.length) return <div className="h-48 bg-gray-100 flex items-center justify-center">Empty Slider</div>;

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {slides.map((slide: any, index: number) => (
                    <CarouselItem key={index}>
                        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                            {slide.image ? (
                                slide.link ? (
                                    <Link href={slide.link} className="w-full h-full block relative">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title || "banner"}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>
                                ) : (
                                    <Image
                                        src={slide.image}
                                        alt={slide.title || "banner"}
                                        fill
                                        className="object-cover"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">No Image</div>
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
        </Carousel>
    );
};

// ============================================================================
// 2. PRODUCT GRID (Daraz Style)
// ============================================================================
export const ProductGridBlock = ({ data }: { data: any }) => {
    const params = useParams();
    const businessUnitId = params.businessUnitId as string;


    const storeId = businessUnitId || params["business-unit"] as string;

    const title = data?.title || "Products";
    const mobileCols = data?.mobileCols || 2;
    const desktopCols = data?.desktopCols || 4;
    const limit = data?.limit || 8;
    const categoryId = data?.categoryId;

    const { data: productsData, isLoading } = useGetStoreProductsQuery(
        {
            businessUnitId: storeId,
            params: {
                categoryId: categoryId,
                limit: limit
            }
        },
        { skip: !storeId }
    );

    const products = productsData?.data || productsData || [];

    // Mock if no products found (optional, or just show empty state)
    // For Builder experience, if loading, show skeletons.
    // If empty, show "No Products Found" or keep mocks if user wants strictly preview? 
    // User wants DATABASE data. So showing real empty state is better than mocks now.

    if (!storeId) return <div className="text-red-500">Error: No Store ID</div>;

    return (
        <div className="py-4">
            <h2 className="text-xl font-bold mb-4 px-4 md:px-0">{title}</h2>

            {/* Responsive Grid using CSS Variables */}
            <div
                className="grid gap-2 md:gap-4 px-2 md:px-0"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(var(--mobile-cols), minmax(0, 1fr))`,
                    // @ts-ignore
                    '--mobile-cols': mobileCols,
                    '--desktop-cols': desktopCols,
                } as React.CSSProperties}
            >
                <style jsx global>{`
                    @media (min-width: 768px) {
                        .storefront-grid-dynamic {
                            grid-template-columns: repeat(var(--desktop-cols), minmax(0, 1fr)) !important;
                        }
                    }
                `}</style>

                <div className="contents storefront-grid-dynamic">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-slate-100 animate-pulse rounded"></div>
                        ))
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-10 bg-slate-50 rounded">
                            No products found in this category.
                        </div>
                    ) : (
                        products.map((p: any) => (
                            <Card key={p._id || p.id} className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-sm h-full flex flex-col">
                                <div className="aspect-square bg-white relative overflow-hidden rounded-t">
                                    {p.images && p.images[0] ? (
                                        <Image
                                            src={p.images[0]}
                                            alt={p.name}
                                            fill
                                            className="object-contain hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-2 flex-1 flex flex-col">
                                    <h3 className="text-sm font-medium line-clamp-2 mb-1">{p.name}</h3>
                                    <div className="mt-auto">
                                        <div className="text-primary font-bold">
                                            ৳ {p.discountPrice || p.price}
                                        </div>
                                        {p.discountPrice && p.price > p.discountPrice && (
                                            <div className="text-xs text-gray-500 line-through">৳ {p.price}</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// 3. BANNER (Single Image)
// ============================================================================
export const BannerBlock = ({ data }: { data: any }) => {
    if (!data?.image) return <div className="p-10 text-center bg-gray-100 border-2 border-dashed m-4">Banner Block (No Image)</div>;

    const Content = (
        <div className="relative w-full h-[150px] md:h-[250px]">
            <Image
                src={data.image}
                alt="promo"
                fill
                className="object-contain md:object-cover"
            />
        </div>
    );

    return (
        <div className="w-full my-4">
            {data.link ? (
                <Link href={data.link} className="block w-full">
                    {Content}
                </Link>
            ) : (
                Content
            )}
        </div>
    );
};

// ============================================================================
// 4. RICH TEXT
// ============================================================================
export const RichTextBlock = ({ data }: { data: any }) => {
    return (
        <div className="prose max-w-none p-4" dangerouslySetInnerHTML={{ __html: data?.content || "" }} />
    );
};
// ============================================================================
// 5. VIDEO BLOCK
// ============================================================================
export const VideoBlock = ({ data }: { data: any }) => {
    if (!data?.url) return <div className="p-10 text-center bg-gray-100 border-2 border-dashed m-4">Video Block (No URL)</div>;

    // Simple YouTube embed check
    let embedUrl = data.url;
    if (data.url.includes('youtube.com/watch?v=')) {
        const videoId = data.url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (data.url.includes('youtu.be/')) {
        const videoId = data.url.split('youtu.be/')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
        <div className="w-full my-6 aspect-video">
            <iframe
                src={embedUrl}
                className="w-full h-full rounded shadow"
                allowFullScreen
                title="Video"
            />
        </div>
    );
};

// ============================================================================
// 6. COUNTDOWN BLOCK (Flash Sale)
// ============================================================================
export const CountdownBlock = ({ data }: { data: any }) => {
    // Mock countdown visual
    return (
        <div className="w-full my-6 bg-red-50 p-6 rounded flex flex-col md:flex-row items-center justify-between border border-red-100">
            <div>
                <h3 className="text-2xl font-bold text-red-600 uppercase">{data?.title || "Flash Sale"}</h3>
                <p className="text-gray-600">Ending soon!</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
                {['02', '12', '45', '30'].map((num, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="bg-white text-gray-900 font-bold text-xl px-3 py-2 rounded shadow w-12 text-center">{num}</div>
                        <span className="text-[10px] uppercase mt-1 text-gray-500">{['Days', 'Hours', 'Mins', 'Secs'][i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


