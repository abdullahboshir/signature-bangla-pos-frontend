
"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useProductForm } from "./hooks/useProductForm";
import { BasicInfo } from "./components/BasicInfo";
import { OrganizationSection } from "./components/OrganizationSection";
import { PricingSection } from "./components/PricingSection";
import { DetailsSection } from "./components/DetailsSection";
import { WarrantySection } from "./components/WarrantySection";
import { InventorySection } from "./components/InventorySection";
import { AttributeSection } from "./components/AttributeSection";
import { ShippingSection } from "./components/ShippingSection";
import { SeoSection } from "./components/SeoSection";
import { ComplianceSection } from "./components/ComplianceSection";
import { BundleSection } from "./components/BundleSection";
import { AttributeGroupSection } from "./components/AttributeGroupSection";

interface AddProductFormProps {
    initialData?: any;
}

export default function AddProductForm({ initialData }: AddProductFormProps) {
    const {
        form,
        isLoading,
        isRefDataLoading,
        isUploading,
        categories,
        brands,
        units,
        businessUnits,
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
        isContextLocked,
        handlePriceChange
    } = useProductForm(initialData);




    if (isRefDataLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground text-sm">Loading product data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{initialData ? "Edit Product" : "Add New Product"}</h1>
                <Button onClick={form.handleSubmit(onSubmit, (errors) => {
                    console.error("Form Validation Errors:", errors);
                    toast.error("Please check the form for errors");
                })} disabled={isLoading || isUploading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (initialData ? "Update Product" : "Create Product")}
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="flex flex-wrap justify-center w-full h-auto gap-2">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="pricing">Pricing</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>

                            {features?.hasInventory && <TabsTrigger value="inventory">Inventory</TabsTrigger>}
                            {features?.hasVariants && <TabsTrigger value="variants">Variants</TabsTrigger>}

                            {features?.hasAttributeGroups && availableAttributeGroups?.length > 0 && (
                                <TabsTrigger value="dynamic_attributes">
                                    {attributeGroupData?.data?.name || "Group Attributes"}
                                </TabsTrigger>
                            )}

                            {features?.hasShipping && <TabsTrigger value="shipping">Shipping</TabsTrigger>}
                            {features?.hasSeo && <TabsTrigger value="seo">SEO</TabsTrigger>}
                            {features?.hasCompliance && <TabsTrigger value="compliance">Safety</TabsTrigger>}
                            {features?.hasBundles && <TabsTrigger value="bundles">Bundles</TabsTrigger>}
                        </TabsList>

                        <div className="mt-4">
                            <TabsContent value="basic" className="space-y-4">
                                <BasicInfo
                                    form={form}
                                    categories={categories}
                                    brands={brands}
                                    level1={level1} setLevel1={setLevel1}
                                    level2={level2} setLevel2={setLevel2}
                                    level3={level3} setLevel3={setLevel3}
                                />
                                <OrganizationSection
                                    form={form}
                                    units={units}
                                    businessUnits={businessUnits}
                                    isLocked={isContextLocked}
                                />
                            </TabsContent>

                            <TabsContent value="pricing">
                                <PricingSection form={form} handlePriceChange={handlePriceChange} />
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4">
                                <DetailsSection
                                    form={form}
                                    isUploading={isUploading}
                                    handleImageUpload={handleImageUpload}
                                    removeImage={removeImage}
                                    appendImage={appendImage}
                                />

                                {features?.hasWarranty && <WarrantySection form={form} />}
                            </TabsContent>

                            {features?.hasInventory && (
                                <TabsContent value="inventory">
                                    <InventorySection form={form} />
                                </TabsContent>
                            )}

                            {features?.hasVariants && (
                                <TabsContent value="variants">
                                    <AttributeSection
                                        form={form}
                                        variantFields={variantFields}
                                        appendVariant={appendVariant}
                                        removeVariant={removeVariant}
                                        replaceVariant={replaceVariant}
                                    />
                                </TabsContent>
                            )}

                            {features?.hasAttributeGroups && availableAttributeGroups?.length > 0 && (
                                <TabsContent value="dynamic_attributes">
                                    <AttributeGroupSection
                                        form={form}
                                        attributeGroupData={attributeGroupData}
                                        dynamicFields={dynamicFields}
                                        availableAttributeGroups={availableAttributeGroups}
                                        selectedAttributeGroupId={selectedAttributeGroupId}
                                        setSelectedAttributeGroupId={setSelectedAttributeGroupId}
                                    />
                                </TabsContent>
                            )}

                            {features?.hasShipping && (
                                <TabsContent value="shipping">
                                    <ShippingSection form={form} />
                                </TabsContent>
                            )}

                            {features?.hasSeo && (
                                <TabsContent value="seo">
                                    <SeoSection form={form} />
                                </TabsContent>
                            )}

                            {features?.hasCompliance && (
                                <TabsContent value="compliance">
                                    <ComplianceSection form={form} />
                                </TabsContent>
                            )}

                            {features?.hasBundles && (
                                <TabsContent value="bundles">
                                    <BundleSection form={form} />
                                </TabsContent>
                            )}
                        </div>
                    </Tabs>
                </form>
            </Form>
        </div>
    );
}
