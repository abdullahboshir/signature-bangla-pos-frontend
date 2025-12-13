
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

export default function AddProductForm() {
    const {
        form,
        isLoading,
        isUploading,
        categories,
        brands,
        units,
        level1, setLevel1,
        level2, setLevel2,
        level3, setLevel3,
        handleImageUpload,
        removeImage,
        appendImage,
        onSubmit,
        variantFields,
        appendVariant,
        removeVariant
    } = useProductForm();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                <Button onClick={form.handleSubmit(onSubmit, (errors) => {
                    console.error("Form Validation Errors:", errors);
                    toast.error("Please check the form for errors");
                })} disabled={isLoading || isUploading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Create Product"}
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 h-auto">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="pricing">Pricing</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="inventory">Inventory</TabsTrigger>
                            <TabsTrigger value="attributes">Attributes</TabsTrigger>
                            <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                            <TabsTrigger value="compliance">Safety</TabsTrigger>
                            <TabsTrigger value="bundles">Bundles</TabsTrigger>
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
                                <OrganizationSection form={form} units={units} />
                            </TabsContent>

                            <TabsContent value="pricing">
                                <PricingSection form={form} />
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4">
                                <DetailsSection
                                    form={form}
                                    isUploading={isUploading}
                                    handleImageUpload={handleImageUpload}
                                    removeImage={removeImage}
                                    appendImage={appendImage}
                                />
                                <WarrantySection form={form} />
                            </TabsContent>

                            <TabsContent value="inventory">
                                <InventorySection form={form} />
                            </TabsContent>

                            <TabsContent value="attributes">
                                <AttributeSection
                                    form={form}
                                    variantFields={variantFields}
                                    appendVariant={appendVariant}
                                    removeVariant={removeVariant}
                                />
                            </TabsContent>

                            <TabsContent value="shipping">
                                <ShippingSection form={form} />
                            </TabsContent>

                            <TabsContent value="seo">
                                <SeoSection form={form} />
                            </TabsContent>

                            <TabsContent value="compliance">
                                <ComplianceSection form={form} />
                            </TabsContent>

                            <TabsContent value="bundles">
                                <BundleSection form={form} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </form>
            </Form>
        </div>
    );
}
