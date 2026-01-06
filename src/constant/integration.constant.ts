export const INTEGRATION_PROVIDER = {
    STRIPE: 'stripe',
    SSLCOMMERZ: 'sslcommerz',
    BKASH: 'bkash',
    PATHAO: 'pathao',
    STEADFAST: 'steadfast',
    REDX: 'redx',
    TWILIO: 'twilio',
    SENDGRID: 'sendgrid',
    SSL_WIRELESS: 'ssl_wireless'
} as const;

export const INTEGRATION_TYPE = {
    PAYMENT: 'payment',
    SHIPPING: 'shipping',
    SMS: 'sms',
    EMAIL: 'email',
    WEBHOOK: 'webhook'
} as const;

export const INTEGRATION_STATUS = {
    ACTIVE: true,
    INACTIVE: false
} as const;

export const INTEGRATION_TYPE_OPTIONS = [
    { label: "Payment Gateway", value: INTEGRATION_TYPE.PAYMENT },
    { label: "Shipping Provider", value: INTEGRATION_TYPE.SHIPPING },
    { label: "SMS Gateway", value: INTEGRATION_TYPE.SMS },
    { label: "Email Provider", value: INTEGRATION_TYPE.EMAIL }
];
