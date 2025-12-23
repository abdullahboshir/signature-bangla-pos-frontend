
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (path: any): string => {
    if (!path) return "/placeholder-image.png";
    
    // Handle Case: Path is not a string (e.g. File object, or nested object)
    if (typeof path !== 'string') {
        if (path instanceof File) return URL.createObjectURL(path); // Fallback for local preview if needed
        if (path.url && typeof path.url === 'string') return getImageUrl(path.url);
        // console.warn("Invalid path passed to getImageUrl:", path);
        return "/placeholder-image.png";
    }

    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    
    // If path is relative, prepend API_URL (or Backend URL)
    // We need to know the backend URL.
    // Assuming environment variable NEXT_PUBLIC_IMAGE_URL or NEXT_PUBLIC_API_URL
    const backendUrl = process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // If backendUrl ends with /api/v1, strip it to get root if images are in /uploads
    // Logic: If images are static files, they are usually at ROOT/uploads
    let rootUrl = backendUrl;
    if (rootUrl.includes("/api/")) {
        rootUrl = rootUrl.split("/api/")[0];
    }
    
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const cleanRoot = rootUrl.endsWith("/") ? rootUrl.slice(0, -1) : rootUrl;
    
    const finalUrl = `${cleanRoot}/${cleanPath}`;
    console.log("getImageUrl Debug:", { input: path, root: rootUrl, backendUrl, cleanPath, finalUrl });
    return finalUrl;
}
