
import { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface ImagePreviewProps {
    src: string;
    alt?: string;
    onRemove?: () => void;
    variant?: "default" | "compact"; // default for details, compact for attributes
}

export const ImagePreview = ({ src, alt = "Image", onRemove, variant = "default" }: ImagePreviewProps) => {
    const [imgSrc, setImgSrc] = useState(getImageUrl(src));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(getImageUrl(src));
        setHasError(false);
    }, [src]);

    if (variant === "compact") {
        return (
            <div className="relative w-12 h-12 border rounded overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imgSrc}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={() => {
                        if (!hasError) {
                            setImgSrc("/placeholder-image.png");
                            setHasError(true);
                        }
                    }}
                />
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-0 right-0 h-4 w-4 bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>
        );
    }

    // Default variant
    return (
        <div className="relative group aspect-square bg-muted rounded-lg overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imgSrc}
                alt={alt}
                className="w-full h-full object-cover"
                onError={() => {
                    if (!hasError) {
                        console.warn("Image load failed:", imgSrc);
                        setImgSrc("/placeholder-image.png");
                        setHasError(true);
                    }
                }}
            />
            {hasError && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs text-muted-foreground bg-white/80 px-1 rounded">Image Broken</span>
            </div>}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1 bg-destructive/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
