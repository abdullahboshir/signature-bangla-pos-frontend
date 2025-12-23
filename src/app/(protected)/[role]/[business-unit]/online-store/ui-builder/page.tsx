"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useGetStorePageQuery, useSavePageMutation } from "@/redux/api/storefrontApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Save, Trash, MoveUp, MoveDown, Eye, ChevronLeft, ChevronRight, PanelLeft, PanelRight } from "lucide-react";
import { toast } from "sonner";
import { BlockRenderer } from "@/components/storefront/Renderer";
import { cn } from "@/lib/utils";
import { StyleControls } from "./StyleControls";

// Initial Block Templates
// Initial Block Templates
const BLOCK_TEMPLATES = [
    { type: 'HERO_SLIDER', label: 'Hero Slider', defaultData: { slides: [], styles: { paddingTop: 0, paddingBottom: 0, container: 'full' } } },
    { type: 'PRODUCT_GRID', label: 'Product Grid', defaultData: { title: 'New Collection', mobileCols: 2, desktopCols: 4, styles: { paddingTop: 40, paddingBottom: 40, container: 'boxed' } } },
    { type: 'BANNER', label: 'Promo Banner', defaultData: { image: '', styles: { paddingTop: 20, paddingBottom: 20, container: 'boxed' } } },
    { type: 'RICH_TEXT', label: 'Text Block', defaultData: { content: '<p>Edit this text...</p>', styles: { paddingTop: 20, paddingBottom: 20, container: 'boxed' } } },
    { type: 'VIDEO', label: 'Video Player', defaultData: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', styles: { paddingTop: 40, paddingBottom: 40, container: 'boxed' } } },
    { type: 'COUNTDOWN', label: 'Flash Sale Timer', defaultData: { title: 'Flash Sale', styles: { paddingTop: 40, paddingBottom: 40, container: 'boxed' } } },
];

const JsonEditor = ({ initialValue, onChange }: { initialValue: any, onChange: (val: any) => void }) => {
    const [value, setValue] = useState(JSON.stringify(initialValue || [], null, 2));
    const [error, setError] = useState(false);

    // Update local state when prop changes (external update), ONLY if not focused? 
    // Actually, simple way: only init once. But if we switch blocks, key changes, so simple state init is fine.
    // However, if we delete a block and undo, this component mounts fresh.
    // To safe guard: We assume Key changes when block changes.

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setValue(val);
        try {
            const parsed = JSON.parse(val);
            setError(false);
            onChange(parsed);
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div>
            <textarea
                className={cn(
                    "w-full h-40 border rounded p-2 text-xs font-mono bg-background text-foreground focus:ring-1 focus:ring-primary",
                    error && "border-red-500 focus:ring-red-500"
                )}
                value={value}
                onChange={handleChange}
            />
            {error && <p className="text-[10px] text-red-500 mt-1">Invalid JSON format</p>}
        </div>
    );
};

const Resizer = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) => (
    <div
        className="w-1 bg-border hover:bg-primary cursor-col-resize z-50 flex items-center justify-center group transition-colors"
        onMouseDown={onMouseDown}
    >
        <div className="w-[1px] h-4 bg-muted-foreground/50 group-hover:bg-primary transition-colors" />
    </div>
);

export default function StoreBuilderPage() {
    // ... existing ...
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const businessUnitId = params["business-unit"] as string;
    const role = params["role"] as string; // Get role

    // UI State
    // Initialize slug from URL param, default to 'home'
    const initialSlug = searchParams.get("slug") || "home";
    const [slug, setSlug] = useState(initialSlug);

    const [blocks, setBlocks] = useState<any[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // Sidebar Toggles & Widths
    const [isLeftOpen, setIsLeftOpen] = useState(true);
    const [isRightOpen, setIsRightOpen] = useState(true);
    const [leftWidth, setLeftWidth] = useState(260); // Default 260px
    const [rightWidth, setRightWidth] = useState(320); // Default 320px
    const [isResizing, setIsResizing] = useState(false); // Track if actively resizing to disable transitions

    const isResizingLeft = React.useRef(false);
    const isResizingRight = React.useRef(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const containerOffset = containerRef.current?.getBoundingClientRect().left || 0;
            const containerWidth = containerRef.current?.getBoundingClientRect().width || window.innerWidth;

            if (isResizingLeft.current) {
                // Calculate width relative to container start, not viewport start
                const newWidth = e.clientX - containerOffset;
                // Relaxed limits: Min 50, Max 85% of screen
                if (newWidth > 50 && newWidth < containerWidth * 0.85) setLeftWidth(newWidth);
            }
            if (isResizingRight.current) {
                // Right width is distance from right edge of window/container?
                // Assuming Builder takes full remaining width. 
                // Distance from mouse to Right Edge of Window.
                // If the builder layout doesn't go to right edge, this implies we need container Right.
                // But usually Dashboard goes to right edge.
                const newWidth = window.innerWidth - e.clientX;
                // Relaxed limits
                if (newWidth > 50 && newWidth < containerWidth * 0.85) setRightWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            if (isResizingLeft.current || isResizingRight.current) {
                isResizingLeft.current = false;
                isResizingRight.current = false;
                setIsResizing(false); // Re-enable transitions
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const startResizeLeft = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizingLeft.current = true;
        setIsResizing(true); // Disable transitions
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

    };

    const startResizeRight = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizingRight.current = true;
        setIsResizing(true); // Disable transitions
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    // API
    const { data: pageData, isLoading, isFetching } = useGetStorePageQuery({ businessUnitId, slug });
    const { data: categories } = useGetCategoriesQuery({});
    const [savePage, { isLoading: isSaving }] = useSavePageMutation();

    // Load initial data
    useEffect(() => {
        if (pageData?.data) {
            setBlocks(pageData.data.blocks || []);
        } else if (!isLoading && !isFetching) {
            setBlocks([]);
        }
    }, [pageData, isLoading, isFetching]);

    // Handlers
    const addBlock = (type: string) => {
        const template = BLOCK_TEMPLATES.find(t => t.type === type);
        const newBlock = {
            id: `block_${Date.now()}`,
            type: type,
            data: template?.defaultData || {},
            isVisible: true,
            order: blocks.length
        };
        setBlocks([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id);
        setIsRightOpen(true);
    };

    const updateBlockData = (id: string, newData: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b));
    };

    const deleteBlock = (id: string) => {
        if (confirm("Are you sure you want to delete this block?")) {
            setBlocks(blocks.filter(b => b.id !== id));
            if (selectedBlockId === id) setSelectedBlockId(null);
        }
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        newBlocks.forEach((b, idx) => b.order = idx);
        setBlocks(newBlocks);
    };

    const handleSave = async () => {
        try {
            await savePage({
                businessUnitId,
                data: {
                    slug,
                    title: `Page ${slug}`,
                    blocks: blocks.map((b, idx) => ({ ...b, order: idx }))
                }
            }).unwrap();
            toast.success("Page layout saved successfully!");
        } catch (error) {
            toast.error("Failed to save layout");
            console.error(error);
        }
    };

    // Derived
    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-background text-foreground overflow-hidden">
            {/* Header Toolbar */}
            <header className="bg-background border-b px-4 py-3 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setIsLeftOpen(!isLeftOpen)} title="Toggle Blocks">
                            <PanelLeft className={cn("w-5 h-5", !isLeftOpen && "text-muted-foreground")} />
                        </Button>
                        <h1 className="font-bold text-lg hidden md:block">UI Builder</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label className="hidden sm:block">Page Slug:</Label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-32 sm:w-40 h-8"
                        />
                        <Button variant="ghost" size="sm" onClick={() => window.open(`/shop/${businessUnitId}/${slug}`, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">View Live</span>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={isSaving} size="sm">
                        {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsRightOpen(!isRightOpen)} title="Toggle Properties">
                        <PanelRight className={cn("w-5 h-5", !isRightOpen && "text-muted-foreground")} />
                    </Button>
                </div>
            </header>

            <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar: Components setup with transition */}
                <aside
                    style={{ width: isLeftOpen ? leftWidth : 0 }}
                    className={cn(
                        "bg-background border-r flex flex-col z-20 h-full shadow-lg md:shadow-none overflow-hidden",
                        isResizing ? "transition-none" : "transition-all duration-300 ease-in-out", // Disable transition during resize
                        !isLeftOpen && "w-0 border-none"
                    )}
                >
                    <div className="min-w-[50px] w-full flex flex-col h-full"> {/* Relaxed min-width */}
                        <div className="p-4 border-b bg-muted/40 font-medium text-sm truncate">Add Blocks</div>
                        <div className="p-4 flex flex-col gap-2 overflow-y-auto">
                            {BLOCK_TEMPLATES.map(t => (
                                <Button
                                    key={t.type}
                                    variant="outline"
                                    className="justify-start text-xs h-9 overflow-hidden"
                                    onClick={() => addBlock(t.type)}
                                    title={t.label}
                                >
                                    <Plus className="w-3 h-3 mr-2 shrink-0" /> <span className="truncate">{t.label}</span>
                                </Button>
                            ))}
                        </div>

                        <div className="p-4 border-t bg-muted/40 font-medium mt-auto text-sm truncate">Layers</div>
                        <div className="p-2 overflow-y-auto flex-1 h-64">
                            {blocks.map((block, index) => (
                                <div
                                    key={block.id}
                                    className={cn(
                                        "flex items-center justify-between p-2 mb-1 rounded text-xs cursor-pointer border",
                                        selectedBlockId === block.id
                                            ? "bg-primary/10 border-primary"
                                            : "bg-background hover:bg-muted/50 border-border"
                                    )}
                                    onClick={() => {
                                        setSelectedBlockId(block.id);
                                        setIsRightOpen(true); // Auto open properties on select
                                    }}
                                >
                                    <span className="truncate w-full text-foreground">{block.type}</span>
                                    {/* Hide controls if too small? Or wrap? */}
                                    <div className="flex gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }} className="p-1 hover:bg-muted rounded disabled:opacity-30">
                                            <MoveUp className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }} className="p-1 hover:bg-muted rounded disabled:opacity-30" disabled={index === blocks.length - 1}>
                                            <MoveDown className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Left Resizer */}
                {isLeftOpen && <Resizer onMouseDown={startResizeLeft} />}

                {/* Middle: Canvas Preview */}
                <main className="flex-1 bg-muted/20 overflow-y-auto p-4 md:p-0 relative w-full h-full">
                    <div className="bg-white min-h-[800px] shadow-sm max-w-[1000px] mx-auto relative pointer-events-none border border-border">
                        <div className="pointer-events-auto">
                            {blocks.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-gray-400">Add blocks from the sidebar</div>
                            ) : (
                                <BlockRenderer blocks={blocks} />
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Resizer */}
                {isRightOpen && <Resizer onMouseDown={startResizeRight} />}

                {/* Right Sidebar: Properties */}
                <aside
                    style={{ width: isRightOpen ? rightWidth : 0 }}
                    className={cn(
                        "bg-background border-l flex flex-col z-20 h-full shadow-lg md:shadow-none overflow-hidden",
                        isResizing ? "transition-none" : "transition-all duration-300 ease-in-out",
                        !isRightOpen && "w-0 border-none"
                    )}
                >
                    <div className="min-w-[50px] w-full flex flex-col h-full"> {/* Relaxed min-width */}
                        <div className="p-4 border-b bg-muted/40 font-medium text-sm flex justify-between items-center bg-background truncate">
                            <span className="truncate">Properties</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 md:hidden shrink-0" onClick={() => setIsRightOpen(false)}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {selectedBlock ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xs text-muted-foreground">{selectedBlock.type}</span>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2" onClick={() => deleteBlock(selectedBlock.id)}>
                                            <Trash className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                    </div>

                                    {/* Dynamic Fields based on Block Type */}
                                    {selectedBlock.type === 'HERO_SLIDER' && (
                                        <div className="space-y-2">
                                            <Label>Slides Configuration</Label>
                                            <div className="text-xs text-muted-foreground mb-1">
                                                Define your slides list here. You can add as many as you need.
                                            </div>

                                            {/* Inline Editor Component to handle local state */}
                                            <JsonEditor
                                                key={selectedBlock.id}
                                                initialValue={selectedBlock.data.slides}
                                                onChange={(val) => updateBlockData(selectedBlock.id, { slides: val })}
                                            />

                                            <div className="mt-2 border-t pt-2">
                                                <Label className="text-xs font-semibold text-muted-foreground">Example Format (Copy & Paste):</Label>
                                                <div className="bg-muted p-2 rounded text-[10px] text-muted-foreground font-mono whitespace-pre-wrap mt-1 select-all cursor-text border overflow-x-auto">
                                                    {`[
  {
    "image": "https://example.com/banner1.jpg",
    "link": "/shop/category/new-arrival"
  },
  {
    "image": "https://example.com/banner2.jpg",
    "link": "/shop/product/123",
    "title": "Big Sale"
  }
]`}
                                                </div>
                                                <div className="mt-2 text-[10px] text-muted-foreground space-y-1">
                                                    <p className="font-semibold">Available Fields:</p>
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        <li><code>image</code>: (Required) Check Media Library for URL.</li>
                                                        <li><code>link</code>: (Optional) URL to open on click.</li>
                                                        <li><code>title</code>: (Optional) Alt text for accessibility.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedBlock.type === 'PRODUCT_GRID' && (
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={selectedBlock.data.title || ''}
                                                onChange={(e) => updateBlockData(selectedBlock.id, { title: e.target.value })}
                                            />

                                            <Label className="text-xs text-muted-foreground mt-2 block">Data Source</Label>
                                            <div className="space-y-2 border p-2 rounded bg-muted/20">
                                                <div>
                                                    <Label className="text-xs">Category</Label>
                                                    <Select
                                                        value={selectedBlock.data.categoryId || 'all'}
                                                        onValueChange={(val) => updateBlockData(selectedBlock.id, { categoryId: val === 'all' ? null : val })}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs">
                                                            <SelectValue placeholder="All Categories" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Categories</SelectItem>
                                                            {categories?.map((c: any) => (
                                                                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Limit (Max Items)</Label>
                                                    <Input
                                                        type="number"
                                                        value={selectedBlock.data.limit || 8}
                                                        onChange={(e) => updateBlockData(selectedBlock.id, { limit: parseInt(e.target.value) })}
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div>
                                                    <Label className="text-xs">Columns (Mobile)</Label>
                                                    <Input
                                                        type="number"
                                                        value={selectedBlock.data.mobileCols || 2}
                                                        onChange={(e) => updateBlockData(selectedBlock.id, { mobileCols: parseInt(e.target.value) })}
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Columns (Desktop)</Label>
                                                    <Input
                                                        type="number"
                                                        value={selectedBlock.data.desktopCols || 4}
                                                        onChange={(e) => updateBlockData(selectedBlock.id, { desktopCols: parseInt(e.target.value) })}
                                                        className="h-8"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedBlock.type === 'BANNER' && (
                                        <div className="space-y-2">
                                            <Label>Image URL</Label>
                                            <Input
                                                value={selectedBlock.data.image || ''}
                                                onChange={(e) => updateBlockData(selectedBlock.id, { image: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {selectedBlock.type === 'RICH_TEXT' && (
                                        <div className="space-y-2">
                                            <Label>HTML Content</Label>
                                            <textarea
                                                className="w-full h-40 border rounded p-2 text-sm bg-background text-foreground focus:ring-1 focus:ring-primary"
                                                value={selectedBlock.data.content || ''}
                                                onChange={(e) => updateBlockData(selectedBlock.id, { content: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {selectedBlock.type === 'VIDEO' && (
                                        <div className="space-y-2">
                                            <Label>Video URL (YouTube)</Label>
                                            <Input
                                                value={selectedBlock.data.url || ''}
                                                onChange={(e) => updateBlockData(selectedBlock.id, { url: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {selectedBlock.type === 'COUNTDOWN' && (
                                        <div className="space-y-2">
                                            <Label>Campaign Title</Label>
                                            <Input
                                                value={selectedBlock.data.title || ''}
                                                onChange={(e) => updateBlockData(selectedBlock.id, { title: e.target.value })}
                                            />
                                            <Label className="text-xs text-muted-foreground mt-2 block">Target Date</Label>
                                            <Input
                                                type="datetime-local"
                                                value={selectedBlock.data.targetDate || ''}
                                                onChange={(e) => updateBlockData(selectedBlock.id, { targetDate: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {/* Generic Style Controls */}
                                    <StyleControls
                                        data={selectedBlock.data}
                                        onChange={(newData) => updateBlockData(selectedBlock.id, newData)}
                                    />

                                </div>
                            ) : (
                                <div className="text-muted-foreground text-sm text-center mt-10">Select a block to edit properties</div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
