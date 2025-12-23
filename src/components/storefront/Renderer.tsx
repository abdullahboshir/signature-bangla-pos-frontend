import { HeroSliderBlock, ProductGridBlock, BannerBlock, RichTextBlock, VideoBlock, CountdownBlock } from './blocks/StoreBlocks';

const BLOCK_COMPONENTS: Record<string, React.FC<any>> = {
    'HERO_SLIDER': HeroSliderBlock,
    'PRODUCT_GRID': ProductGridBlock,
    'BANNER': BannerBlock,
    'RICH_TEXT': RichTextBlock,
    'VIDEO': VideoBlock,
    'COUNTDOWN': CountdownBlock,
};

interface BlockRendererProps {
    blocks: any[];
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className="storefront-canvas w-full max-w-[1400px] mx-auto bg-white min-h-screen">
            {blocks
                .filter(b => b.isVisible !== false)
                .sort((a, b) => a.order - b.order)
                .map((block) => {
                    const Component = BLOCK_COMPONENTS[block.type];
                    if (!Component) {
                        return <div key={block.id} className="p-4 text-red-500 border border-red-200 m-2">Unknown Block Type: {block.type}</div>;
                    }
                    return (
                        <div
                            key={block.id}
                            style={{
                                paddingTop: `${block.data?.styles?.paddingTop || 20}px`,
                                paddingBottom: `${block.data?.styles?.paddingBottom || 20}px`,
                                backgroundColor: block.data?.styles?.backgroundColor || 'transparent',
                                height: block.data?.styles?.height ? `${block.data.styles.height}px` : 'auto',
                            }}
                        >
                            <div className={block.data?.styles?.container === 'full' ? 'w-full' : 'container mx-auto px-4 max-w-[1200px]'}>
                                <Component data={block.data} />
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};
