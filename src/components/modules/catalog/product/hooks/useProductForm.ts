import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { defaultProductValues, productSchema, ProductFormValues } from "../product.schema";

import { 
    useGetCategoriesQuery, 
} from "@/redux/api/catalog/categoryApi";

import { useGetBrandsQuery } from "@/redux/api/catalog/brandApi";
import { useGetUnitsQuery } from "@/redux/api/catalog/unitApi";
import { useGetTaxsQuery } from "@/redux/api/finance/taxApi";
import { 
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useGetProductQuery,
} from "@/redux/api/catalog/productApi";
import { useUploadFileMutation } from "@/redux/api/system/uploadApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery, useGetBusinessUnitByIdQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetAttributeGroupQuery } from "@/redux/api/catalog/attributeGroupApi";
import { usePermissions } from "@/hooks/usePermissions";
import { useCurrentRole } from "@/hooks/useCurrentRole";

export const useProductForm = (initialData?: any) => {
    const router = useRouter();
    const params = useParams();
    const { currentRole } = useCurrentRole();
    const role = currentRole as string;
    const businessUnit = params["business-unit"] as string;
    // productId is now derived from initialData if available, or params
    const productId = (initialData?._id || params["id"]) as string;
    
    // Fetch Attribute Group Data
    // We need to resolve the business unit ID first.
    // If user is super-admin, they might select BU in form. But for now let's assume context BU or selected BU.
    // However, useProductForm is initialized with 'businessUnit' param.
    const effectiveBusinessUnitId = businessUnit; 

    // RTK Query Hooks
    // RTK Query Hooks - Sequential Loading as per user request
    const { data: cats = [], isLoading: isCatsLoading, isSuccess: isCatsSuccess } = useGetCategoriesQuery({ 
        limit: 5000,
        ...(effectiveBusinessUnitId && effectiveBusinessUnitId !== 'global' ? { businessUnit: effectiveBusinessUnitId } : {})
    });
    


    const { data: brands = [], isLoading: isBrandsLoading, isSuccess: isBrandsSuccess } = useGetBrandsQuery({ limit: 1000 });
    const { data: units = [], isLoading: isUnitsLoading, isSuccess: isUnitsSuccess } = useGetUnitsQuery({ limit: 1000 });

    const { user } = useAuth();
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    const { data: busUnits = [], isLoading: isBusUnitsLoading } = useGetBusinessUnitsQuery(
        { limit: 100 },
        { skip: !isSuperAdmin }
    );

    // Wait until ALL required data is successfully fetched
    const isRefDataLoading = !isCatsSuccess || !isBrandsSuccess || !isUnitsSuccess;

    // Fetch Attribute Group Data
    // We need to resolve the business unit ID first.
    // If user is super-admin, they might select BU in form. But for now let's assume context BU or selected BU.
    // However, useProductForm is initialized with 'businessUnit' param.
    
    // Optimized: Fetch Business Unit details
    const { data: businessUnitDetails } = useGetBusinessUnitByIdQuery(effectiveBusinessUnitId, { 
        skip: !effectiveBusinessUnitId || effectiveBusinessUnitId === 'global'
    });

    const features = businessUnitDetails?.features || {
        hasInventory: true,
        hasVariants: true,
        hasAttributeGroups: true,
        hasShipping: true,
        hasSeo: true,
        hasCompliance: true,
        hasBundles: true,
        hasWarranty: true
    };

    const availableAttributeGroups = useMemo(() => {
        if (!businessUnitDetails) return [];
        const groups: any[] = [];
        
        // 1. Handle array of groups (New Standard)
        if (businessUnitDetails.attributeGroups && Array.isArray(businessUnitDetails.attributeGroups)) {
            groups.push(...businessUnitDetails.attributeGroups);
        }
        
        // 2. Handle legacy single group
        if (businessUnitDetails.attributeGroup) {
             const legacy = businessUnitDetails.attributeGroup;
             const id = typeof legacy === 'object' ? legacy._id : legacy;
             // Avoid duplicates
             if (!groups.find(g => (typeof g === 'object' ? g._id : g) === id)) {
                 groups.push(legacy);
             }
        }
        return groups;
    }, [businessUnitDetails]);

    const [selectedAttributeGroupId, setSelectedAttributeGroupId] = useState<string>("");

    // Auto-select first group
    useEffect(() => {
        if (!selectedAttributeGroupId && availableAttributeGroups.length > 0) {
            const first = availableAttributeGroups[0];
            setSelectedAttributeGroupId(typeof first === 'object' ? first._id : first);
        }
    }, [availableAttributeGroups, selectedAttributeGroupId]);

    // OPTIMIZATION: Check if the selected group is already fully loaded in availableAttributeGroups
    // This prevents a redundant API call if the Business Unit already populated the data.
    const preLoadedGroup = useMemo(() => {
        if (!selectedAttributeGroupId) return null;
        const found = availableAttributeGroups.find(g => 
            (typeof g === 'object' ? g._id : g) === selectedAttributeGroupId
        );
        // Only return if it's an object AND has fields (meaning it was populated)
        if (found && typeof found === 'object' && Array.isArray(found.fields)) {
            return found;
        }
        return null;
    }, [availableAttributeGroups, selectedAttributeGroupId]);

    // Skip query if we have preLoadedGroup
    const { data: fetchedAttributeGroupData } = useGetAttributeGroupQuery(selectedAttributeGroupId, { 
        skip: !selectedAttributeGroupId || !!preLoadedGroup
    });

    // Merge: Use pre-loaded data structure ({ data: ... }) to match API response format, or use fetched data
    const attributeGroupData = preLoadedGroup ? { data: preLoadedGroup } : fetchedAttributeGroupData;

    const dynamicFields = attributeGroupData?.data?.fields || [];

    // We don't need to fetch inside the hook if data is passed, but for safety/refresh we might.
    // However, the edit page already fetches it. Let's rely on initialData primarily.
    
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [uploadFile, { isLoading: isUploadingImage }] = useUploadFileMutation();

    const [level1, setLevel1] = useState<string>("");
    const [level2, setLevel2] = useState<string>("");
    const [level3, setLevel3] = useState<string>("");

    const isLoading = isCreating || isUpdating; // Removed isProductLoading since we pass data
    const isUploading = isUploadingImage;

    // Initialize Form
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            ...defaultProductValues,
            businessUnit: businessUnit || "", // Pre-fill businessUnit from params if available
        },
        mode: "onChange",
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant, replace: replaceVariant } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // ... (rest of logic) ...



    // MERGE Initial Data into Lists (Robustness for Edit Mode)
    // This ensures that even if the referenced item is not in the fetched list (limit/pagination), it is still available.
    const mergedBrands = useMemo(() => {
        if (!initialData?.brands || !initialData.brands.length) return brands;
        // Merge unique
        const cleanBrands = initialData.brands.map((b: any) => typeof b === 'object' ? b : null).filter(Boolean);
        if (!cleanBrands.length) return brands;
        
        const existingIds = new Set(brands.map((b: any) => String(b._id || b.id)));
        const newBrands = cleanBrands.filter((b: any) => !existingIds.has(String(b._id || b.id)));
        return [...brands, ...newBrands];
    }, [brands, initialData]);

    const mergedUnits = useMemo(() => {
        const initUnit = initialData?.unit;
        if (!initUnit || typeof initUnit !== 'object') return units;
        
        const existingIds = new Set(units.map((u: any) => String(u._id || u.id)));
        if (!existingIds.has(String(initUnit._id || initUnit.id))) {
             return [...units, initUnit];
        }
        return units;
    }, [units, initialData]);


    // Simplified Categories (Just return roots or flat list depending on need, for now just cats)
    const categories = useMemo(() => {
        if (isRefDataLoading) return []; 
        return cats;
    }, [cats, isRefDataLoading]);


    // Populate Form when initialData is provided
    useEffect(() => {
        if (initialData && !isRefDataLoading) { // Wait for ref data
            // Helper to safely get ID
            const getId = (item: any) => {
                if (!item) return "";
                if (typeof item === 'string') return item;
                return item._id || item.id || "";
            };

            const pCat = getId(initialData.primaryCategory || initialData.category);
            const unitVal = getId(initialData.unit);
            const businessUnitVal = getId(initialData.businessUnit);
            const brandsVal = initialData.brands?.map((b: any) => getId(b)) || [];

            console.log("DEBUG: Form Initialization IDs ->", { 
                pCat, unitVal, businessUnitVal, brandsVal,
                pCatType: typeof pCat, 
                hasBrands: brandsVal.length 
            });

            // Set Local State for UI Cascading
            if (pCat) setLevel1(pCat);

            // Transform Variants
            const rawVariants = initialData.variants || initialData.variantTemplate?.variants || [];
            
            const transformedVariants = rawVariants.map((v: any) => {
                const options = [];
                if (v.attributes) {
                    if (Array.isArray(v.attributes)) {
                         // Already in expected format or needs value extraction
                         v.attributes.forEach((attr: any) => {
                             if (attr.name && attr.value) {
                                 options.push({ name: attr.name, value: String(attr.value) });
                             } else if (typeof attr === 'string') {
                                 // Fallback?
                             }
                         });
                    } else {
                        const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;
                        for (const [key, value] of Object.entries(attrs)) {
                            // Skip if value is object (mongo artifact?) unless we expect it
                            if (typeof value === 'object' && value !== null) {
                                 // Try to find value inside?
                                 if ((value as any).value) options.push({ name: key, value: String((value as any).value) });
                            } else {
                                options.push({ name: key, value: String(value) });
                            }
                        }
                    }
                }

                return {
                    id: v._id || v.variantId, 
                    name: v.name || v.variantId || options.map(o => o.value).join("-"),
                    sku: v.sku,
                    price: v.pricing?.basePrice || v.price || 0,
                    stock: v.inventory?.stock || v.stock || 0,
                    images: v.images || [],
                    options: options,
                    isDefault: v.isDefault || false
                };
            });

            // Map Backend Data to Form Values
            const formValues: ProductFormValues = {
                name: initialData.name,
                nameBangla: initialData.nameBangla || "",
                slug: initialData.slug,
                sku: initialData.sku || initialData.inventory?.sku || "",

                businessUnit: businessUnitVal,
                unit: unitVal,
                
                primaryCategory: pCat,
                
                brands: brandsVal,
                images: initialData.details?.images || [],
                tags: initialData.tags || [],
                tagsBangla: initialData.tagsBangla || [],
                
                pricing: {
                    costPrice: initialData.pricing?.costPrice || 0,
                    basePrice: initialData.pricing?.basePrice || 0,
                    profitMargin: initialData.pricing?.profitMargin || 0,
                    profitMarginType: initialData.pricing?.profitMarginType || "percentage",
                    tax: initialData.pricing?.tax || initialData.tax || { vatType: "inclusive", vatAmount: 0, taxType: "inclusive", taxAmount: 0, taxClass: "standard", taxRate: 0, taxInclusive: true },
                    currency: initialData.pricing?.currency || "BDT"
                },
                
                barcode: initialData.barcode || initialData.inventory?.barcode || "",
                inventory: {
                    inventory: {
                        trackQuantity: initialData.inventory?.manageStock ?? true,
                        stock: initialData.inventory?.inventory?.stock || initialData.inventory?.stock || 0, 
                        lowStockThreshold: initialData.inventory?.inventory?.lowStockThreshold || initialData.inventory?.lowStockThreshold || 5,
                        allowBackorder: false,
                    },
                    suppliers: []
                },
                
                details: {
                    description: initialData.details?.description || "",
                    shortDescription: initialData.details?.shortDescription || "",
                    images: initialData.details?.images || [],
                    origin: initialData.details?.origin || initialData.origine || "Bangladesh",
                    manufacturer: initialData.details?.manufacturer || "",
                    model: initialData.details?.model || initialData.productmodel || ""
                },
                
                shipping: {
                    delivery: initialData.shipping?.delivery || initialData.delivery || { estimatedDelivery: "2-3 days", availableFor: "home_delivery", cashOnDelivery: true, installationAvailable: false },
                    packagingType: initialData.shipping?.packagingType || "box",
                    shippingClass: initialData.shipping?.shippingClass || "standard",
                    physicalProperties: initialData.shipping?.physicalProperties || { weightUnit: "kg", dimensions: { unit: "cm", length: 0, width: 0, height: 0 } }
                },

                statusInfo: {
                    status: initialData.statusInfo?.status || "draft",
                },
                marketing: {
                    isFeatured: initialData.marketing?.isFeatured || false,
                    isNew: initialData.marketing?.isNew || false,
                    isBestSeller: initialData.marketing?.isBestSeller || false,
                    isPopular: initialData.marketing?.isPopular || false,
                    isTrending: initialData.marketing?.isTrending || false,
                    seo: {
                        metaTitle: initialData.marketing?.seo?.metaTitle || "",
                        metaDescription: initialData.marketing?.seo?.metaDescription || "",
                        keywords: initialData.marketing?.seo?.keywords || [],
                        canonicalUrl: initialData.marketing?.seo?.canonicalUrl || ""
                    }
                },
            
                variants: transformedVariants,
                hasVariants: (transformedVariants.length > 0 || initialData.hasVariants || false),
                isBundle: initialData.isBundle || false,
                categories: [pCat].filter(Boolean), 
                warranty: initialData.warranty || defaultProductValues.warranty,
            };    
            
            // Hard Reset to ensure defaultValues are replaced
            console.log("DEBUG: executing form.reset()", { pCat });
            form.reset(formValues);

            // Removed harmful setTimeout that was overwriting values
        }
    }, [initialData, form, replaceVariant, isRefDataLoading]); 

    // Price Calculation Logic
    const handlePriceChange = (type: 'cost' | 'selling' | 'margin', value: string) => {
        // Convert to number or undefined for calculation, but keeping flexible
        const numValue = value === "" ? 0 : parseFloat(value);
        
        // Update the trigger field immediately (allow empty string for UI)
        // We cast to any because our Schema is strict number, but RHF allows temporary deviation OR we should use setValueAs? 
        // Better: We update the field with number (0) if empty? 
        // The user wants to see empty. 
        // Let's set it to valid number for now to satisfy TS, but we might encounter the "0" issue again if we don't fix Input.
        // Actually, let's just use the `number` value here and let the UI handle the `NaN/String` aspect via the handler call.
        
        // Wait, the Input `onChange` passes a string or number.
        // Let's accept `string` from Input (e.target.value) to handle empty properly.
        
        const currentCost = type === 'cost' ? numValue : (parseFloat(String(form.getValues("pricing.costPrice"))) || 0);
        const currentMargin = type === 'margin' ? numValue : (parseFloat(String(form.getValues("pricing.profitMargin"))) || 0);
        const currentSelling = type === 'selling' ? numValue : (parseFloat(String(form.getValues("pricing.basePrice"))) || 0);
        const marginType = form.getValues("pricing.profitMarginType") || "percentage";

        if (type === 'cost') {
             // form.setValue("pricing.costPrice", numValue); // Don't update self
             
             // Update Selling based on Cost + Margin only if Margin is set
             // User Request: "selling price calculate hobe profit margin deyar por"
             // This prevents the 1:1 mirroring when Margin is 0.
             if (currentMargin > 0) {
                 let newSelling = 0;
                 if (marginType === 'percentage') {
                     newSelling = numValue * (1 + (currentMargin / 100));
                 } else {
                     newSelling = numValue + currentMargin;
                 }
                 form.setValue("pricing.basePrice", parseFloat(newSelling.toFixed(2)));
             }
        } 
        else if (type === 'margin') {
            // form.setValue("pricing.profitMargin", numValue); // Don't update self
            
            // Update Selling based on Cost + Margin
             let newSelling = 0;
             if (marginType === 'percentage') {
                 newSelling = currentCost * (1 + (numValue / 100));
             } else {
                 newSelling = currentCost + numValue;
             }
             form.setValue("pricing.basePrice", parseFloat(newSelling.toFixed(2)));
        } 
        else if (type === 'selling') {
            // form.setValue("pricing.basePrice", numValue); // Don't update self
            
            // Update Margin based on (Selling - Cost)
            if (currentCost > 0) {
                let newMargin = 0;
                if (marginType === 'percentage') {
                    newMargin = ((numValue - currentCost) / currentCost) * 100;
                } else {
                    newMargin = numValue - currentCost;
                }
                form.setValue("pricing.profitMargin", parseFloat(newMargin.toFixed(2)));
            }
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                const res = await uploadFile(formData).unwrap();
                return res?.url || res; 
            });
            
            const urls = (await Promise.all(uploadPromises)).filter(Boolean);

            const currentImages = form.getValues("details.images") || [];
            const updatedImages = [...currentImages, ...urls];

            form.setValue("details.images", updatedImages, { shouldDirty: true, shouldValidate: true });
            toast.success("Images uploaded!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload images");
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
        try {
            // Transform Payload
            const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            const payload: any = {
                ...data,
                slug,
                businessUnit: isSuperAdmin ? data.businessUnit : businessUnit, // Use form data if super admin
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
            
            // If super admin and global/empty selected, ensure it sends null/undefined or specific value? 
            if (payload.businessUnit === 'global') payload.businessUnit = undefined;

            // Cleanup payload: Remove empty strings for optional ObjectId fields
            // This prevents "Invalid ObjectId" errors if backend sanitation fails or Zod validation handles strict strings.
            const optionalObjectIds = ['primaryCategory', 'unit', 'outlet'];
            optionalObjectIds.forEach(field => {
                if (payload[field] === "") {
                    delete payload[field];
                }
            });

            console.log("Submitting Transformed Payload:", payload);

            if (productId) {
                 await updateProduct({ id: productId, body: payload }).unwrap();
                 toast.success("Product updated successfully!");
            } else {
                 await createProduct(payload).unwrap();
                 toast.success("Product created successfully!");
            }
            
            if (isSuperAdmin) {
                 router.push(`/super-admin/catalog/product`);
            } else {
                 router.push(`/${role}/${businessUnit}/catalog/product`);
            }
        } catch (error: any) {
            console.error("Save Product Error Details:", JSON.stringify(error, null, 2));
            console.error("Save Product Error Raw:", error);
            if (error?.status === 400 && error?.data?.message) {
                 toast.error(`Validation Error: ${error.data.message}`);
            } else {
                 toast.error(error?.data?.message || "Failed to save product");
            }
        }
    };

    return {
        form,
        isLoading,
        isRefDataLoading,
        isUploading,
        categories,
        brands: mergedBrands,
        units: mergedUnits,
        businessUnits: busUnits, // Return businessUnits
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
        replaceVariant,
        attributeGroupData,
        dynamicFields,
        availableAttributeGroups,
        selectedAttributeGroupId,

        setSelectedAttributeGroupId,
        features,
        handlePriceChange,
        isContextLocked: !!businessUnit, // Expose lock status
    };
};
