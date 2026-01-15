import { z } from "zod";

// Helper for minimal ID validation (frontend doesn't check ObjectId validity securely)
const objectIdSchema = z.string().min(1, "Required");

export const productSchema = z.object({
  // Core
  name: z.string().min(1, "Product name is required").max(100),
  nameBangla: z.string().optional(),
  slug: z.string().optional(),
  sku: z.string().min(1, "SKU is required").or(z.literal("")).optional(), // Allow empty string or valid SKU
  barcode: z.string().optional(),

  domain: z
    .enum([
      "retail",
      "pharmacy",
      "grocery",
      "restaurant",
      "electronics",
      "fashion",
      "service",
      "construction",
      "automotive",
      "health",
      "hospitality",
      "other",
    ])
    .default("retail"),
  outlet: z.string().optional(),
  businessUnit: z.string().optional(),
  availableModules: z.array(z.string()).optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  primaryCategory: z.string().min(1, "Primary category is required"),

  crossSellProducts: z.array(z.string()).optional(),
  upsellProducts: z.array(z.string()).optional(),

  brands: z.array(z.string()).optional(),

  images: z.array(z.string()).min(1, "At least one image is required"),
  videos: z.array(z.string()).optional(),

  tags: z.array(z.string()).optional(),
  tagsBangla: z.array(z.string()).optional(),

  translations: z
    .array(
      z.object({
        lang: z.string(),
        field: z.string(),
        value: z.string(),
      })
    )
    .optional(),

  unit: z.string().min(1, "Unit is required"),

  // Attributes
  attributes: z
    .object({
      isOrganic: z.boolean().default(false).optional(),
      isElectric: z.boolean().default(false).optional(),
      isFragile: z.boolean().default(false).optional(),
      isPerishable: z.boolean().default(false).optional(),
      isHazardous: z.boolean().default(false).optional(),
      isDigital: z.boolean().default(false).optional(),
      isService: z.boolean().default(false).optional(), // e.g. Installation
      ageRestricted: z.boolean().default(false).optional(),
      minAge: z.number().min(0).optional(),
      prescriptionRequired: z.boolean().default(false).optional(),
      prescriptionType: z.enum(["online", "physical"]).optional(),
    })
    .catchall(z.any())
    .optional(),

  // Pricing
  pricing: z.object({
    basePrice: z.number().min(0),
    salePrice: z.number().min(0).optional(),
    currency: z.enum(["BDT", "USD"]).default("BDT"),
    costPrice: z.number().min(0).default(0),
    profitMargin: z.number().min(0).default(0),
    profitMarginType: z.enum(["percentage", "fixed"]).default("percentage"),
    discount: z
      .object({
        amount: z.number().min(0).default(0),
        type: z.enum(["percentage", "fixed"]).default("percentage"),
        isActive: z.boolean().default(false),
      })
      .optional(),

    // Flash Sale
    flashSale: z
      .object({
        price: z.number().min(0).optional(),
        stock: z.number().min(0).optional(),
        startDate: z.string().optional(), // Date picker returns ISO string
        endDate: z.string().optional(),
      })
      .optional(),

    // Wholesale Tiers
    wholesaleTiers: z
      .array(
        z.object({
          minQuantity: z.number().min(1),
          maxQuantity: z.number().optional(),
          price: z.number().min(0),
        })
      )
      .optional(),
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
    suppliers: z.array(z.any()).optional(),
  }),

  // Details
  details: z.object({
    description: z.string().min(1, "Description is required"),
    shortDescription: z.string().min(1, "Short description is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    origin: z.string().min(1, "Origin is required"),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    video: z
      .object({
        provider: z.enum(["youtube", "vimeo", "dailymotion"]).optional(),
        link: z
          .string()
          .url("Must be a valid URL")
          .or(z.literal(""))
          .optional(),
      })
      .optional(),
  }),

  // Shipping
  shipping: z.object({
    physicalProperties: z.object({
      weight: z.number().optional(),
      weightUnit: z.enum(["kg", "g", "lb"]).default("kg"),
      dimensions: z
        .object({
          length: z.number().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
          unit: z.enum(["cm", "inch"]).default("cm"),
        })
        .optional(),
    }),
    delivery: z.object({
      estimatedDelivery: z.string().min(1, "Delivery time estimate required"),
      estimatedDeliveryBangla: z.string().optional(),
      availableFor: z
        .enum(["home_delivery", "pickup", "both"])
        .default("home_delivery"),
      cashOnDelivery: z.boolean().default(true),
      installationAvailable: z.boolean().default(false),
      installationCost: z.number().min(0).optional(),
    }),
    packagingType: z.string().default("box"),
    shippingClass: z.string().default("standard"),
  }),

  // Compliance
  compliance: z
    .object({
      hasCertification: z.boolean().default(false),
      certifications: z.array(z.string()).optional(),
      importRestrictions: z.array(z.string()).optional(),
      safetyStandards: z.array(z.string()).optional(),
    })
    .optional(),

  // Warranty
  warranty: z.object({
    warranty: z
      .object({
        hasWarranty: z.boolean().default(false),
        duration: z.number().min(0).optional(),
        type: z.enum(["seller", "manufacturer", "brand"]).default("seller"),
        periodUnit: z.enum(["days", "months", "years"]).default("months"),
      })
      .optional(),
    returnPolicy: z
      .object({
        allowed: z.boolean().default(true),
        period: z.number().default(7),
        returnShipping: z
          .enum(["seller_paid", "buyer_paid"])
          .default("buyer_paid"),
      })
      .optional(),
  }),

  // Marketing (SEO)
  marketing: z
    .object({
      isFeatured: z.boolean().default(false),
      isNew: z.boolean().default(false),
      isPopular: z.boolean().default(false),
      isBestSeller: z.boolean().default(false),
      isTrending: z.boolean().default(false),
      seo: z
        .object({
          metaTitle: z.string().min(1, "Meta Title required"),
          metaDescription: z.string().min(1, "Meta Description required"),
          keywords: z.array(z.string()).optional(),
          canonicalUrl: z.string().optional(),
        })
        .optional(),
      socialShares: z.number().optional(),
      wishlistCount: z.number().optional(),
    })
    .optional(),

  // Bundles
  isBundle: z.boolean().default(false),
  bundleProducts: z
    .array(
      z.object({
        product: z.string(), // ObjectId
        quantity: z.number().min(1),
        discount: z.number().optional(),
      })
    )
    .optional(),
  bundleDiscount: z.number().min(0).optional(),

  // Variants
  hasVariants: z.boolean().default(false),
  variantTemplate: z.string().optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        options: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
          })
        ),
        sku: z.string().optional(),
        price: z.number().min(0).optional(),
        stock: z.number().min(0).default(0),
        images: z.array(z.string()).default([]),
        isDefault: z.boolean().default(false),
      })
    )
    .optional(),

  statusInfo: z
    .object({
      status: z
        .enum(["draft", "published", "archived", "under_review", "suspended"])
        .default("draft"),
    })
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const defaultProductValues: ProductFormValues = {
  name: "",
  nameBangla: "",
  slug: "",
  sku: "",
  barcode: "",
  domain: "retail",
  businessUnit: "",
  primaryCategory: "",
  availableModules: [
    "pos",
    "ecommerce",
    "logistics",
    "crm",
    "marketing",
    "integrations",
  ],

  categories: [],
  unit: "",
  tags: [],
  tagsBangla: [],
  images: [],
  videos: [],

  translations: [],
  crossSellProducts: [],
  upsellProducts: [],

  attributes: {
    isOrganic: false,
    isElectric: false,
    isFragile: false,
    isPerishable: false,
    isHazardous: false,
    isDigital: false,
    isService: false,
    ageRestricted: false,
    prescriptionRequired: false,
  },
  pricing: {
    currency: "BDT",
    basePrice: 0,
    costPrice: 0,
    profitMargin: 0,
    profitMarginType: "percentage",
    tax: {
      taxable: false,
      taxClass: "standard",
      taxRate: 0,
      taxInclusive: false,
    },
    flashSale: {
      price: 0,
      stock: 0,
      startDate: undefined,
      endDate: undefined,
    },
    wholesaleTiers: [],
  },
  inventory: {
    inventory: {
      trackQuantity: true,
      stock: 0,
      lowStockThreshold: 5,
      allowBackorder: false,
    },
  },
  details: {
    description: "",
    shortDescription: "",
    images: [],
    origin: "Bangladesh",
    manufacturer: "",
    model: "",
    video: {
      provider: "youtube",
      link: "",
    },
  },
  shipping: {
    delivery: {
      estimatedDelivery: "2-3 days",
      estimatedDeliveryBangla: "",
      availableFor: "home_delivery",
      cashOnDelivery: true,
      installationAvailable: false,
      installationCost: 0,
    },
    packagingType: "box",
    shippingClass: "standard",
    physicalProperties: {
      weightUnit: "kg",
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm",
      },
    },
  },
  compliance: {
    hasCertification: false,
    certifications: [],
    safetyStandards: [],
    importRestrictions: [],
  },
  warranty: {
    warranty: {
      hasWarranty: false,
      periodUnit: "months",
      type: "seller",
      duration: 0,
    },
    returnPolicy: {
      allowed: true,
      period: 7,
      returnShipping: "buyer_paid",
    },
  },
  marketing: {
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    isPopular: false,
    isTrending: false,
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
    },
    socialShares: 0,
    wishlistCount: 0,
  },
  isBundle: false,
  bundleProducts: [],
  bundleDiscount: 0,
  hasVariants: false,
  variants: [],
  statusInfo: {
    status: "draft",
  },
};
