
import { z } from "zod";

// Helper for minimal ID validation (frontend doesn't check ObjectId validity securely)
const objectIdSchema = z.string().min(1, "Required");

export const productSchema = z.object({
  // Core
  name: z.string().min(1, "Product name is required").max(100),
  nameBangla: z.string().optional(),
  slug: z.string().optional(), // generated
  sku: z.string().optional(), // generated
  
  businessUnit: z.string().optional(), // Injected from context usually
  categories: z.array(z.string()).min(1, "At least one category is required"),
  primaryCategory: z.string().min(1, "Primary category is required"),
  brands: z.array(z.string()).optional(),
  
  tags: z.array(z.string()).optional(),
  tagsBangla: z.array(z.string()).optional(),

  unit: z.enum(['kg', 'gram', 'piece', 'dozen', 'litre', 'ml']).default('piece'),

  // Pricing
  pricing: z.object({
    basePrice: z.number().min(0),
    salePrice: z.number().min(0).optional(),
    currency: z.enum(["BDT", "USD"]).default("BDT"),
    costPrice: z.number().min(0).default(0),
    profitMargin: z.number().min(0).default(0),
    discount: z.object({
      amount: z.number().min(0).default(0),
      type: z.enum(["percentage", "fixed"]).default("percentage"),
      isActive: z.boolean().default(false)
    }).optional(),
    tax: z.object({
      taxable: z.boolean().default(false),
      taxClass: z.string().min(1, "Tax Class required").default("standard"),
      taxRate: z.number().min(0).default(0),
      taxInclusive: z.boolean().default(false),
      hscode: z.string().optional(),
    }),
  }),

  // Inventory
  inventory: z.object({
    inventory: z.object({
      trackQuantity: z.boolean().default(true),
      stock: z.number().min(0).default(0),
      lowStockThreshold: z.number().default(5),
      allowBackorder: z.boolean().default(false),
    }),
    suppliers: z.array(z.any()).optional(), // Simplified for now
  }),

  // Details
  details: z.object({
    description: z.string().min(1, "Description is required"),
    shortDescription: z.string().min(1, "Short description is required"),
    images: z.array(z.string().url("Invalid URL")).min(1, "At least one image is required"),
    origin: z.string().min(1, "Origin is required"),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
  }),

  // Shipping
  shipping: z.object({
     physicalProperties: z.object({
        weight: z.number().optional(),
        weightUnit: z.enum(["kg", "g", "lb"]).default("kg"),
         dimensions: z.object({
          length: z.number().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
          unit: z.enum(["cm", "inch"]).default("cm")
        }).optional(),
     }),
     delivery: z.object({
        estimatedDelivery: z.string().min(1, "Delivery time estimate required"),
        availableFor: z.enum(["home_delivery", "pickup", "both"]).default("home_delivery"),
        cashOnDelivery: z.boolean().default(true),
     }),
     packagingType: z.string().default("box"),
     shippingClass: z.string().default("standard")
  }),

  // Warranty
  warranty: z.object({
    warranty: z.object({
        hasWarranty: z.boolean().default(false),
        duration: z.number().min(0).optional(),
        type: z.enum(["seller", "manufacturer", "brand"]).default("seller"),
        periodUnit: z.enum(["days", "months", "years"]).default("months"),
    }).optional(),
     returnPolicy: z.object({
        allowed: z.boolean().default(true),
        period: z.number().default(7),
        returnShipping: z.enum(["seller_paid", "buyer_paid"]).default("buyer_paid")
    }).optional()
  }),
  
   // Marketing (SEO)
  marketing: z.object({
    isFeatured: z.boolean().default(false),
    isNew: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    seo: z.object({
        metaTitle: z.string().min(1, "Meta Title required"),
        metaDescription: z.string().min(1, "Meta Description required"),
        keywords: z.array(z.string()).optional(),
        canonicalUrl: z.string().optional(),
    })
  }).optional(),
  
  // Variants
  hasVariants: z.boolean().default(false),
  variants: z.array(z.object({
      id: z.string().optional(),
      name: z.string().optional(), // e.g. "Size-Red" or specific combination name
      options: z.array(z.object({
          name: z.string(), // "Color"
          value: z.string() // "Red"
      })),
      sku: z.string().optional(),
      price: z.number().min(0).optional(),
      stock: z.number().min(0).default(0),
      isDefault: z.boolean().default(false)
  })).optional(),

  statusInfo: z.object({
      status: z.enum(["draft", "published", "archived", "under_review", "suspended"]).default("draft")
  }).optional()

});

export type ProductFormValues = z.infer<typeof productSchema>;

export const defaultProductValues: ProductFormValues = {
    name: "",
    primaryCategory: "",
    categories: [],
    unit: "piece",
    tags: [],
    tagsBangla: [],
    pricing: {
        currency: "BDT",
        basePrice: 0,
        costPrice: 0,
        profitMargin: 0,
        tax: {
            taxable: false,
            taxClass: "standard",
            taxRate: 0,
            taxInclusive: false,
        }
    },
    inventory: {
        inventory: {
            trackQuantity: true,
            stock: 0,
            lowStockThreshold: 5,
            allowBackorder: false,
        }
    },
    details: {
        description: "",
        shortDescription: "",
        images: [],
        origin: "Bangladesh", // Default to local
        manufacturer: "",
        model: ""
    },
    shipping: {
        delivery: {
            estimatedDelivery: "2-3 days",
            availableFor: "home_delivery",
            cashOnDelivery: true
        },
        packagingType: "box",
        shippingClass: "standard",
         physicalProperties: {
            weightUnit: "kg",
             dimensions: { 
                length: 0,
                width: 0,
                height: 0,
                unit: "cm" 
             }
        }
    },
    warranty: {
        warranty: {
            hasWarranty: false,
            periodUnit: "months",
            type: "seller",
            duration: 0
        },
        returnPolicy: {
            allowed: true,
            period: 7,
            returnShipping: "buyer_paid"
        }
    },
    marketing: {
        isFeatured: false,
        isNew: false,
        isBestSeller: false,
        seo: {
            metaTitle: "",
            metaDescription: "",
            keywords: [],
            canonicalUrl: ""
        }
    },
    hasVariants: false,
    variants: [],
    statusInfo: {
        status: "draft"
    }
};
