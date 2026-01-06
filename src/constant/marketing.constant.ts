export const DISCOUNT_TYPE = {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed'
} as const;

export const DISCOUNT_TYPE_OPTIONS = [
    { label: "Percentage", value: DISCOUNT_TYPE.PERCENTAGE },
    { label: "Fixed Amount", value: DISCOUNT_TYPE.FIXED }
];

export const MARKETING_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    EXPIRED: 'expired',
    SCHEDULED: 'scheduled'
} as const;

export const MARKETING_STATUS_OPTIONS = [
    { label: "Active", value: MARKETING_STATUS.ACTIVE },
    { label: "Inactive", value: MARKETING_STATUS.INACTIVE },
    { label: "Expired", value: MARKETING_STATUS.EXPIRED },
    { label: "Scheduled", value: MARKETING_STATUS.SCHEDULED }
];
