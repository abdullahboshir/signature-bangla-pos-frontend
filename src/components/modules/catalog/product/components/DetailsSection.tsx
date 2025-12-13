
import { UseFormReturn } from "react-hook-form";
import { Loader2, Trash2, Upload } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface DetailsSectionProps {
    form: UseFormReturn<ProductFormValues>;
    isUploading: boolean;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    removeImage: (index: number) => void;
    appendImage: (url: string) => void;
}

export const DetailsSection = ({ form, isUploading, handleImageUpload, removeImage, appendImage }: DetailsSectionProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Description & Media</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="details.shortDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description (Summary)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief summary of the product..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="details.description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[200px]" placeholder="Detailed product description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <FormLabel>Product Images</FormLabel>
                            <span className="text-xs text-muted-foreground">{isUploading ? "Uploading..." : "Upload or Enter URL"}</span>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter image URL..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const input = e.currentTarget;
                                            if (input.value.trim()) {
                                                appendImage(input.value.trim());
                                                input.value = "";
                                            }
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        if (input.value.trim()) {
                                            appendImage(input.value.trim());
                                            input.value = "";
                                        }
                                    }}
                                >
                                    Add URL
                                </Button>
                            </div>

                            {/* Upload Zone */}
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative shadow-sm">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer h-full z-10"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                                <div className="bg-primary/10 p-4 rounded-full mb-3">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-semibold text-sm">Click to upload image</h4>
                                <p className="text-xs text-muted-foreground mt-1">or drag and drop SVG, PNG, JPG or GIF</p>
                                {isUploading && <Loader2 className="absolute top-4 right-4 h-4 w-4 animate-spin text-primary" />}
                            </div>

                            {/* Image Preview Grid */}
                            {form.watch("details.images")?.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                    {form.watch("details.images").map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-square bg-muted rounded-lg overflow-hidden border">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-destructive/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
