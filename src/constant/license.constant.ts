export const LICENSE_STATUS = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    REVOKED: 'revoked'
} as const;

export const LICENSE_STATUS_OPTIONS = [
    { label: "Active", value: LICENSE_STATUS.ACTIVE },
    { label: "Expired", value: LICENSE_STATUS.EXPIRED },
    { label: "Revoked", value: LICENSE_STATUS.REVOKED }
];
