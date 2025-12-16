import { useEffect, useState } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { defaultProductValues, productSchema, ProductFormValues } from "../product.schema";
import { productService } from "@/services/catalog/product.service";
import { fileUploadService } from "@/services/common/file-upload.service";

import { unitService } from "@/services/catalog/unit.service";

export const useProductForm = () => {
    const router = useRouter();
    const params = useParams();
    const role = params.role as string;
    const businessUnit = params["business-unit"] as string;
    const productId = params["id"] as string; // Get Product ID from URL params

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]); // New State for Units
    const [level1, setLevel1] = useState<string>("");
    const [level2, setLevel2] = useState<string>("");
    const [level3, setLevel3] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    // Initialize Form
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: defaultProductValues,
        mode: "onChange",
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant, replace: replaceVariant } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // Fetch Dependencies & Product Data (if Edit)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, subCats, childCats, brnds, fetchedUnits] = await Promise.all([
                    productService.getCategories(),
                    productService.getSubCategories(),
                    productService.getChildCategories(),
                    productService.getBrands(),
                    unitService.getAll() // Fetch Units
                ]);

                const allCategories = [...cats, ...subCats, ...childCats];

                const smartBuild = () => {
                    const map = new Map();
                    // Add all to map
                    allCategories.forEach(c => map.set(String(c._id || c.id), { ...c, children: [] }));

                    // Link children to parents
                    let linkCount = 0;
                    allCategories.forEach(c => {
                        const rawParent = c.parent || c.parentId || c.parent_id || c.category || c.subCategory || c.categoryId || c.subCategoryId || c.rootCategory;
                        if (!rawParent) return; // Skip roots

                        const parentId = typeof rawParent === 'object' ? String(rawParent._id || rawParent.id) : String(rawParent);

                        // If parent exists and is in map, add this node to parent's children
                        if (map.has(parentId)) {
                            const childNode = map.get(String(c._id || c.id));
                            const parentNode = map.get(parentId);
                            // Avoid duplicates
                            if (!parentNode.children.find((child: any) => String(child._id || child.id) === String(childNode._id || childNode.id))) {
                                parentNode.children.push(childNode);
                                linkCount++;
                            }
                        }
                    });
                    // Get the Level 1 items from the map
                    const roots = cats.map((c: any) => map.get(String(c._id || c.id))).filter(Boolean);
                    return roots;
                }

                setCategories(smartBuild());
                setBrands(brnds);
                setUnits(fetchedUnits); // Set Units

                // Fetch Product Data if in Edit Mode
                if (productId) {
                    setIsLoading(true);
                    const productData = await productService.getById(productId);
                    
                    if (productData) {
                        // Map Backend Data to Form Values
                        const formValues: ProductFormValues = {
                            name: productData.name,
                            slug: productData.slug,
                            sku: productData.sku || productData.inventory?.sku || "",

                            businessUnit: productData.businessUnit?._id || productData.businessUnit,
                            unit: productData.unit?._id || productData.unit,
                            primaryCategory: productData.primaryCategory?._id || productData.primaryCategory,
                            brands: productData.brands?.map((b: any) => b._id || b) || [],
                            
                            pricing: {
                                costPrice: productData.pricing?.costPrice || 0,
                                basePrice: productData.pricing?.basePrice || 0,
                                profitMargin: productData.pricing?.profitMargin || 0,
                                profitMarginType: productData.pricing?.profitMarginType || "percentage",
                                tax: productData.pricing?.tax || productData.tax || { vatType: "inclusive", vatAmount: 0, taxType: "inclusive", taxAmount: 0 },
                                currency: productData.pricing?.currency || "BDT"
                            },
                            
                            barcode: productData.barcode || productData.inventory?.barcode || "",
                            inventory: {
                                inventory: {
                                    trackQuantity: productData.inventory?.manageStock ?? true,
                                    stock: productData.inventory?.inventory?.stock || 0,
                                    lowStockThreshold: productData.inventory?.inventory?.lowStockThreshold || 5,
                                    allowBackorder: false, // Default or map if available
                                },
                                suppliers: []
                            },
                            
                            details: {
                                description: productData.details?.description || "",
                                shortDescription: productData.details?.shortDescription || "",
                                images: productData.details?.images || [],
                                origin: productData.details?.origin || "Bangladesh",
                                manufacturer: productData.details?.manufacturer || "",
                                model: productData.details?.model || ""
                            },
                            
                            shipping: {
                                delivery: productData.shipping?.delivery || { estimatedDelivery: "2-3 days", availableFor: "home_delivery", cashOnDelivery: true, installationAvailable: false },
                                packagingType: productData.shipping?.packagingType || "box",
                                shippingClass: productData.shipping?.shippingClass || "standard",
                                physicalProperties: productData.shipping?.physicalProperties || { weightUnit: "kg", dimensions: { unit: "cm", length: 0, width: 0, height: 0 } }
                            },

                            statusInfo: {
                                status: productData.statusInfo?.status || "draft",
                            },
                             marketing: {
                                isFeatured: productData.marketing?.isFeatured || false,
                                isNew: productData.marketing?.isNew || false,
                                isBestSeller: productData.marketing?.isBestSeller || false,
                                isPopular: productData.marketing?.isPopular || false,
                                isTrending: productData.marketing?.isTrending || false,
                                seo: {
                                    metaTitle: productData.marketing?.seo?.metaTitle || "",
                                    metaDescription: productData.marketing?.seo?.metaDescription || "",
                                    keywords: productData.marketing?.seo?.keywords || [],
                                    canonicalUrl: productData.marketing?.seo?.canonicalUrl || ""
                                }
                             },
                             
                             variants: [] // Populate variants if needed
                        };
                        
                        form.reset(formValues);
                    }
                    setIsLoading(false);
                }

            } catch (error) {
                console.error("Error fetching dependencies:", error);
                toast.error("Failed to load data");
            }
        };
        fetchData();
    }, [productId]); // Add productId dependency

    // Price Calculation Logic
    const watchedCostPrice = form.watch("pricing.costPrice");
    const watchedProfitMargin = form.watch("pricing.profitMargin");
    const watchedProfitType = form.watch("pricing.profitMarginType");

    useEffect(() => {
        const cost = parseFloat(String(watchedCostPrice)) || 0;
        const margin = parseFloat(String(watchedProfitMargin)) || 0;
        let base = 0;

        if (watchedProfitType === 'percentage') {
            base = cost + (cost * (margin / 100));
        } else {
            base = cost + margin;
        }

        const roundedBase = Math.round(base * 100) / 100;
        // Only auto-calculate if user hasn't manually overridden it? 
        // For simplicity, let's keep it syncing for now, but in Edit mode be careful not to overwrite if logic differs.
        // Actually, normally in Edit you might want to see the stored `basePrice` first. 
        // But since `reset` happens once, this effect might trigger after reset. 
        // If the stored values are consistent (Cost+Margin = Base), it's fine.
        form.setValue("pricing.basePrice", roundedBase);
    }, [watchedCostPrice, watchedProfitMargin, watchedProfitType, form]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setIsUploading(true);
            const uploadPromises = Array.from(files).map(file => fileUploadService.uploadImage(file));
            const urls = await Promise.all(uploadPromises);

            const currentImages = form.getValues("details.images") || [];
            const updatedImages = [...currentImages, ...urls];

            form.setValue("details.images", updatedImages, { shouldDirty: true, shouldValidate: true });
            toast.success("Images uploaded!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload images");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues("details.images") || [];
        const updatedImages = currentImages.filter((_, i) => i !== index);
        form.setValue("details.images", updatedImages, { shouldDirty: true, shouldValidate: true });
    };

    const appendImage = (url: string) => {
        if (!url) return;
        const currentImages = form.getValues("details.images") || [];
        form.setValue("details.images", [...currentImages, url], { shouldDirty: true, shouldValidate: true });
    };

    const onSubmit = async (data: ProductFormValues) => {
        setIsLoading(true);
        try {
            // Transform Payload
            const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            const payload = {
                ...data,
                slug,
                businessUnit: businessUnit, 
                tax: data.pricing.tax,
                delivery: data.shipping.delivery,
                unit: data.unit, 
                vendor: {
                    id: "675306915015792caa3905c1", 
                    name: "Signature Bangla",
                    rating: 5,
                    isVerified: true
                },
                marketing: {
                    ...data.marketing,
                    seo: {
                        ...data.marketing?.seo,
                        slug: slug, 
                    }
                }
            };

            console.log("Submitting Transformed Payload:", payload);

            if (productId) {
                 await productService.update(productId, payload as any);
                 toast.success("Product updated successfully!");
            } else {
                 await productService.create(payload as any);
                 toast.success("Product created successfully!");
            }
            
            router.push(`/${role}/${businessUnit}/catalog/product`);
        } catch (error: any) {
            console.error("Save Product Error:", error);
            toast.error(error?.response?.data?.message || "Failed to save product");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        isUploading,
        categories,
        brands,
        units, // Expose Units
        level1, setLevel1,
        level2, setLevel2,
        level3, setLevel3,
        handleImageUpload,
        removeImage,
        appendImage,
        onSubmit,
        variantFields,
        appendVariant,
        removeVariant,
        replaceVariant, // Expose replace
    };
};

