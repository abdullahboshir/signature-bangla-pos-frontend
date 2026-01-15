export const PRODUCT_STATUS = {
  DRAFT: "draft",
  UNDER_REVIEW: "under_review",
  PUBLISHED: "published",
  REJECTED: "rejected",
  ARCHIVED: "archived",
  SUSPENDED: "suspended",
} as const;

export const PRODUCT_STATUS_OPTIONS = [
  { label: "Draft", value: PRODUCT_STATUS.DRAFT },
  { label: "Under Review", value: PRODUCT_STATUS.UNDER_REVIEW },
  { label: "Published", value: PRODUCT_STATUS.PUBLISHED },
  { label: "Rejected", value: PRODUCT_STATUS.REJECTED },
  { label: "Archived", value: PRODUCT_STATUS.ARCHIVED },
  { label: "Suspended", value: PRODUCT_STATUS.SUSPENDED },
];

export const PRODUCT_STOCK_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
  LIMITED_STOCK: "limited_stock",
} as const;

export const PRODUCT_STOCK_STATUS_OPTIONS = [
  { label: "In Stock", value: PRODUCT_STOCK_STATUS.IN_STOCK },
  { label: "Out of Stock", value: PRODUCT_STOCK_STATUS.OUT_OF_STOCK },
  { label: "Limited Stock", value: PRODUCT_STOCK_STATUS.LIMITED_STOCK },
];

export const WEIGHT_UNIT = {
  KG: "kg",
  G: "g",
  LB: "lb",
} as const;

export const WEIGHT_UNIT_OPTIONS = [
  { label: "Kilogram (kg)", value: WEIGHT_UNIT.KG },
  { label: "Gram (g)", value: WEIGHT_UNIT.G },
  { label: "Pound (lb)", value: WEIGHT_UNIT.LB },
];

export const DIMENSION_UNIT = {
  CM: "cm",
  INCH: "inch",
} as const;

export const DIMENSION_UNIT_OPTIONS = [
  { label: "Centimeter (cm)", value: DIMENSION_UNIT.CM },
  { label: "Inch (in)", value: DIMENSION_UNIT.INCH },
];

export const DELIVERY_AVAILABLE_FOR = {
  HOME_DELIVERY: "home_delivery",
  PICKUP: "pickup",
  BOTH: "both",
} as const;

export const DELIVERY_AVAILABLE_FOR_OPTIONS = [
  { label: "Home Delivery", value: DELIVERY_AVAILABLE_FOR.HOME_DELIVERY },
  { label: "Pickup", value: DELIVERY_AVAILABLE_FOR.PICKUP },
  { label: "Both", value: DELIVERY_AVAILABLE_FOR.BOTH },
];

export const PRESCRIPTION_TYPE = {
  ONLINE: "online",
  PHYSICAL: "physical",
} as const;

export const PRESCRIPTION_TYPE_OPTIONS = [
  { label: "Online", value: PRESCRIPTION_TYPE.ONLINE },
  { label: "Physical", value: PRESCRIPTION_TYPE.PHYSICAL },
];
export const PRODUCT_DOMAIN = {
  RETAIL: "retail",
  PHARMACY: "pharmacy",
  GROCERY: "grocery",
  RESTAURANT: "restaurant",
  ELECTRONICS: "electronics",
  FASHION: "fashion",
  SERVICE: "service",
  CONSTRUCTION: "construction",
  AUTOMOTIVE: "automotive",
  HEALTH: "health",
  HOSPITALITY: "hospitality",
  OTHER: "other",
} as const;

export const PRODUCT_DOMAIN_OPTIONS = [
  { label: "Retail", value: PRODUCT_DOMAIN.RETAIL },
  { label: "Pharmacy", value: PRODUCT_DOMAIN.PHARMACY },
  { label: "Grocery", value: PRODUCT_DOMAIN.GROCERY },
  { label: "Restaurant", value: PRODUCT_DOMAIN.RESTAURANT },
  { label: "Electronics", value: PRODUCT_DOMAIN.ELECTRONICS },
  { label: "Fashion", value: PRODUCT_DOMAIN.FASHION },
  { label: "Service", value: PRODUCT_DOMAIN.SERVICE },
  { label: "Construction", value: PRODUCT_DOMAIN.CONSTRUCTION },
  { label: "Automotive", value: PRODUCT_DOMAIN.AUTOMOTIVE },
  { label: "Health", value: PRODUCT_DOMAIN.HEALTH },
  { label: "Hospitality", value: PRODUCT_DOMAIN.HOSPITALITY },
  { label: "Other", value: PRODUCT_DOMAIN.OTHER },
];

export const AVAILABLE_MODULES = {
  POS: "pos",
  ECOMMERCE: "ecommerce",
  LOGISTICS: "logistics",
  CRM: "crm",
  MARKETING: "marketing",
  INTEGRATIONS: "integrations",
} as const;

export const AVAILABLE_MODULES_OPTIONS = [
  { label: "POS Terminal", value: AVAILABLE_MODULES.POS },
  { label: "Online Storefront", value: AVAILABLE_MODULES.ECOMMERCE },
  { label: "Logistics & Warehouse", value: AVAILABLE_MODULES.LOGISTICS },
  { label: "Corporate CRM", value: AVAILABLE_MODULES.CRM },
  { label: "Marketing Automation", value: AVAILABLE_MODULES.MARKETING },
  { label: "Marketplace Sync", value: AVAILABLE_MODULES.INTEGRATIONS },
];
