import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { defaultProductValues, productSchema, ProductFormValues } from "../product.schema";

import { 
    useGetCategoriesQuery, 
} from "@/redux/api/categoryApi";
import { useGetSubCategoriesQuery } from "@/redux/api/subCategoryApi";
import { useGetChildCategoriesQuery } from "@/redux/api/childCategoryApi";
import { useGetBrandsQuery } from "@/redux/api/brandApi";
import { useGetUnitsQuery } from "@/redux/api/unitApi";
import { useGetTaxesQuery } from "@/redux/api/taxApi";
import { 
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useGetProductQuery,
} from "@/redux/api/productApi";
import { useUploadFileMutation } from "@/redux/api/uploadApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery, useGetBusinessUnitByIdQuery } from "@/redux/api/businessUnitApi";
import { useGetAttributeGroupByIdQuery } from "@/redux/api/attributeGroupApi";

export const useProductForm = (initialData?: any) => {
    const router = useRouter();
    const params = useParams();
    const role = params.role as string;
    const businessUnit = params["business-unit"] as string;
    // productId is now derived from initialData if available, or params
    const productId = (initialData?._id || params["id"]) as string;

    // RTK Query Hooks
    // RTK Query Hooks - Sequential Loading as per user request
    const { data: cats = [], isLoading: isCatsLoading, isSuccess: isCatsSuccess } = useGetCategoriesQuery({ limit: 1000 });
    
    const { data: subCats = [], isLoading: isSubCatsLoading, isSuccess: isSubCatsSuccess } = useGetSubCategoriesQuery(
        { limit: 1000 }, 
        { skip: !isCatsSuccess }
    );
    
    const { data: childCats = [], isLoading: isChildCatsLoading, isSuccess: isChildCatsSuccess } = useGetChildCategoriesQuery(
        { limit: 1000 }, 
        { skip: !isSubCatsSuccess }
    );

    const { data: brands = [], isLoading: isBrandsLoading, isSuccess: isBrandsSuccess } = useGetBrandsQuery({ limit: 1000 });
    const { data: units = [], isLoading: isUnitsLoading, isSuccess: isUnitsSuccess } = useGetUnitsQuery({ limit: 1000 });

    const { user } = useAuth();
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    const { data: busUnits = [], isLoading: isBusUnitsLoading } = useGetBusinessUnitsQuery(
        { limit: 100 },
        { skip: !isSuperAdmin }
    );

    // Wait until ALL required data is successfully fetched
    const isRefDataLoading = !isCatsSuccess || !isSubCatsSuccess || !isChildCatsSuccess || !isBrandsSuccess || !isUnitsSuccess;

    // Fetch Attribute Group Data
    // We need to resolve the business unit ID first.
    // If user is super-admin, they might select BU in form. But for now let's assume context BU or selected BU.
    // However, useProductForm is initialized with 'businessUnit' param.
    const effectiveBusinessUnitId = businessUnit; // For now use the param-based BU. Dynamic switching might need form watch.
    
    const { data: businessUnitDetails } = useGetBusinessUnitByIdQuery(effectiveBusinessUnitId, { 
        skip: !effectiveBusinessUnitId || effectiveBusinessUnitId === 'global'
    });

    const attributeGroupId = businessUnitDetails?.attributeGroup?._id || businessUnitDetails?.attributeGroup;

    const { data: attributeGroupData } = useGetAttributeGroupByIdQuery(attributeGroupId, { 
        skip: !attributeGroupId 
    });

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
        defaultValues: defaultProductValues,
        mode: "onChange",
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant, replace: replaceVariant } = useFieldArray({
        control: form.control,
        name: "variants",
    });

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


    // Smart Build Categories
    const categories = useMemo(() => {
        if (isRefDataLoading) return []; 
        
        console.log("DEBUG: Building Tree - Layered Approach");

        // 1. Initialize Roots Map
        const rootMap = new Map();
        cats.forEach((c: any) => {
            const id = String(c._id || c.id);
            rootMap.set(id, { ...c, children: [] });
        });

        // 2. Process SubCategories
        const subMap = new Map();
        subCats.forEach((s: any) => {
            const sId = String(s._id || s.id);
            const subNode = { ...s, children: [] };
            subMap.set(sId, subNode);

            // Link to Root
            // SubCategory model has 'category'
            const parentId = s.category ? String(s.category._id || s.category.id || s.category) : "";
            if (parentId && rootMap.has(parentId)) {
                rootMap.get(parentId).children.push(subNode);
            } else {
               // console.warn("Orphan SubCategory (Parent not in Roots):", s.name);
            }
        });

        // 3. Process ChildCategories
        childCats.forEach((ch: any) => {
            const chId = String(ch._id || ch.id);
            const childNode = { ...ch, children: [] }; // Children of Child is empty

            // Link to SubCategory
            // ChildCategory model has 'subCategory'
            const parentId = ch.subCategory ? String(ch.subCategory._id || ch.subCategory.id || ch.subCategory) : "";
            if (parentId && subMap.has(parentId)) {
                subMap.get(parentId).children.push(childNode);
            } else {
               // console.warn("Orphan ChildCategory (Parent not in Subs):", ch.name);
            }
        });

        // 4. Handle Initial Data Injection (if missing from fetched lists)
        if (initialData) {
            // Helper to inject correct layer
            const inject = (item: any, type: 'root' | 'sub' | 'child') => {
                 if (!item || typeof item !== 'object') return;
                 const id = String(item._id || item.id);
                 
                 if (type === 'root') {
                     if (!rootMap.has(id)) {
                         rootMap.set(id, { ...item, children: [] });
                     }
                 }
                 else if (type === 'sub') {
                     if (!subMap.has(id)) {
                         const subNode = { ...item, children: [] };
                         subMap.set(id, subNode);
                         // Try to link to parent if exists
                         const pId = item.category ? String(item.category._id || item.category.id || item.category) : "";
                         if (pId && rootMap.has(pId)) {
                             rootMap.get(pId).children.push(subNode);
                         }
                     }
                 }
                 else if (type === 'child') {
                      // We don't track childMap, just link to sub
                      const pId = item.subCategory ? String(item.subCategory._id || item.subCategory.id || item.subCategory) : "";
                      if (pId && subMap.has(pId)) {
                          // Check if already added
                           const parent = subMap.get(pId);
                           if (!parent.children.find((x: any) => String(x._id || x.id) === id)) {
                               parent.children.push({ ...item, children: [] });
                           }
                      }
                 }
            };

            inject(initialData.primaryCategory || initialData.category, 'root');
            inject(initialData.subCategory, 'sub');
            inject(initialData.childCategory, 'child');
        }

        const roots = Array.from(rootMap.values());
        console.log(`DEBUG: Layered Tree Built -> Roots: ${roots.length}`);
        
        // Diagnostic sample
        const sampleRoot = roots.find((r: any) => r.children.length > 0);
        if (sampleRoot) {
            console.log(`DEBUG: Sample Root '${sampleRoot.name}' has ${sampleRoot.children.length} subcats`);
            const sampleSub = sampleRoot.children.find((s: any) => s.children.length > 0);
             if (sampleSub) {
                 console.log(`DEBUG: Sample Sub '${sampleSub.name}' has ${sampleSub.children.length} childcats`);
             }
        }
        
        return roots;
    }, [cats, subCats, childCats, isRefDataLoading, initialData]);


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
            const sCat = getId(initialData.subCategory);
            const cCat = getId(initialData.childCategory);
            const unitVal = getId(initialData.unit);
            const businessUnitVal = getId(initialData.businessUnit);
            
            const brandsVal = initialData.brands?.map((b: any) => getId(b)) || [];

            console.log("DEBUG: Form Initialization IDs ->", { 
                pCat, sCat, cCat, unitVal, businessUnitVal, brandsVal,
                pCatType: typeof pCat, 
                sCatType: typeof sCat,
                hasBrands: brandsVal.length 
            });

            // Set Local State for UI Cascading
            if (pCat) setLevel1(pCat);
            if (sCat) setLevel2(sCat);
            if (cCat) setLevel3(cCat);

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
                subCategory: sCat,
                childCategory: cCat,
                
                brands: initialData.brands?.map((b: any) => getId(b)) || [],
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
                categories: [pCat, sCat, cCat].filter(Boolean), 
                warranty: initialData.warranty || defaultProductValues.warranty,
            };    
            
            // Hard Reset to ensure defaultValues are replaced
            console.log("DEBUG: executing form.reset()", { pCat, sCat, cCat });
            form.reset(formValues);

            // Removed harmful setTimeout that was overwriting values
        }
    }, [initialData, form, replaceVariant, isRefDataLoading]); 

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
        // Keep syncing basePrice
        form.setValue("pricing.basePrice", roundedBase);
    }, [watchedCostPrice, watchedProfitMargin, watchedProfitType, form]);

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
            
            const payload = {
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
            // Our backend likely expects null for global.
            if (payload.businessUnit === 'global') payload.businessUnit = undefined;


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
            console.error("Save Product Error:", error);
            toast.error(error?.data?.message || "Failed to save product");
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
    };
};
