export const BUSINESS_UNIT_STATUS = {
  DRAFT: 'draft',
  UNDER_REVIEW: 'under_review',
  PUBLISHED: 'published',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
  // Legacy
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const BUSINESS_UNIT_TYPE = {
  GENERAL: 'general',
  BOUTIQUE: 'boutique',
  BRAND: 'brand',
  MARKETPLACE: 'marketplace',
  SPECIALTY: 'specialty',
  // Legacy
  RETAIL: 'retail',
  WHOLESALE: 'wholesale',
  SERVICE: 'service',
} as const;

export const BUSINESS_UNIT_STATUS_OPTIONS = [
  { value: BUSINESS_UNIT_STATUS.PUBLISHED, label: 'Published' },
  { value: BUSINESS_UNIT_STATUS.DRAFT, label: 'Draft' },
  { value: BUSINESS_UNIT_STATUS.UNDER_REVIEW, label: 'Under Review' },
  { value: BUSINESS_UNIT_STATUS.SUSPENDED, label: 'Suspended' },
  { value: BUSINESS_UNIT_STATUS.ARCHIVED, label: 'Archived' },
  // Legacy Options
  { value: BUSINESS_UNIT_STATUS.ACTIVE, label: 'Active' },
  { value: BUSINESS_UNIT_STATUS.INACTIVE, label: 'Inactive' },
];

export const BUSINESS_UNIT_TYPE_OPTIONS = [
  { value: BUSINESS_UNIT_TYPE.GENERAL, label: 'General' },
  { value: BUSINESS_UNIT_TYPE.BOUTIQUE, label: 'Boutique' },
  { value: BUSINESS_UNIT_TYPE.BRAND, label: 'Brand' },
  { value: BUSINESS_UNIT_TYPE.MARKETPLACE, label: 'Marketplace' },
  { value: BUSINESS_UNIT_TYPE.SPECIALTY, label: 'Specialty' },
  // Legacy Options
  { value: BUSINESS_UNIT_TYPE.RETAIL, label: 'Retail' },
  { value: BUSINESS_UNIT_TYPE.WHOLESALE, label: 'Wholesale' },
  { value: BUSINESS_UNIT_TYPE.SERVICE, label: 'Service' },
];

