
import { UseFormReturn } from "react-hook-form";
import { Loader2, Trash2, Upload } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface ImageUploadProps {
    form: UseFormReturn<ProductFormValues>;
    isUploading: boolean;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    removeImage: (index: number) => void;
}

export const ImageUpload = ({ form, isUploading, handleImageUpload, removeImage }: ImageUploadProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Description & Media</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {/* We removed description from here in the refactor plan? No, "Details" tab had description. 
                    Let's check the original file. Details tab had Short Description, Full Description AND Images.
                    The plan said "ImageUpload.tsx", maybe I should call it "DetailsSection.tsx" if it includes descriptions?
                    The plan listed "ImageUpload.tsx" as "Drag & Drop, Preview Grid".
                    But where will Description go?
                    
                    The original AddProductForm has "Details" tab which includes Description + Images.
                    I should probably include Descriptions here or rename this component to DetailsSection.
                    Let's stick to the Plan's component list but ensure we don't lose the Description fields.
                    
                    The plan didn't explicitly mention "DescriptionSection.tsx".
                    I will include the Description fields HERE in ImageUpload.tsx, OR rename it to DetailsSection.tsx.
                    Renaming to DetailsSection.tsx is safer and more accurate.
                */}

                {/* Wait, the user plan says:
                    ├── ImageUpload.tsx          # Drag & Drop, Preview Grid
                    
                    It missed "Description".
                    I will create `DetailsSection.tsx` INSTEAD of `ImageUpload.tsx` to handle both descriptions and images, 
                    matching the "Details" tab of the original form.
                */}
            </CardContent>
        </Card>
    );
};
