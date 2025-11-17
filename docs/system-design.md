📁 src/
├── 📁 app/
│   ├── 📁 (public)/                    # Public routes
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 page.tsx
│   │   ├── 📁 auth/
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx         # /auth/login
│   │   │   ├── 📁 register/
│   │   │   │   └── 📄 page.tsx         # /auth/register
│   │   │   └── 📁 forgot-password/
│   │   │       └── 📄 page.tsx         # /auth/forgot-password
│   │   ├── 📁 features/
│   │   │   └── 📄 page.tsx
│   │   └── 📁 demo/
│   │       └── 📄 page.tsx
│   │
│   └── 📁 (protected)/                 # Protected - all roles here
│       ├── 📄 layout.tsx               # Auth guard + role check
│       │
│       ├── 📁 [role]/                  # 🎯 DYNAMIC ROLE - From Database!
│       │   ├── 📄 layout.tsx           # Role-specific layout
│       │   ├── 📄 page.tsx             # Role home page
│       │   │
│       │   ├── 📁 [businessUnit]/      # 🎯 DYNAMIC BUSINESS UNIT
│       │   │   ├── 📄 layout.tsx       # Business unit context
│       │   │   ├── 📄 page.tsx         # Unit overview
│       │   │   │
│       │   │   ├── 📁 dashboard/
│       │   │   │   ├── 📄 page.tsx     # /[role]/[businessUnit]/dashboard
│       │   │   │   ├── 📁 analytics/
│       │   │   │   │   └── 📄 page.tsx
│       │   │   │   └── 📁 reports/
│       │   │   │       └── 📄 page.tsx
│       │   │   │
│       │   │   ├── 📁 pos/             # POS Terminal (if permitted)
│       │   │   │   ├── 📄 page.tsx     # /[role]/[businessUnit]/pos
│       │   │   │   ├── 📁 cart/
│       │   │   │   │   └── 📄 page.tsx
│       │   │   │   └── 📁 checkout/
│       │   │   │       └── 📄 page.tsx
│       │   │   │
│       │   │   ├── 📁 management/      # Content Management
│       │   │   │   ├── 📁 products/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   ├── 📁 new/
│       │   │   │   │   │   └── 📄 page.tsx
│       │   │   │   │   └── 📁 [productId]/
│       │   │   │   │       ├── 📄 page.tsx
│       │   │   │   │       └── 📁 edit/
│       │   │   │   │           └── 📄 page.tsx
│       │   │   │   │
│       │   │   │   ├── 📁 categories/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   └── 📁 [categoryId]/
│       │   │   │   │       └── 📄 page.tsx
│       │   │   │   │
│       │   │   │   ├── 📁 inventory/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   └── 📁 [itemId]/
│       │   │   │   │       ├── 📄 page.tsx
│       │   │   │   │       └── 📁 stock/
│       │   │   │   │           └── 📄 page.tsx
│       │   │   │   │
│       │   │   │   ├── 📁 customers/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   ├── 📁 new/
│       │   │   │   │   │   └── 📄 page.tsx
│       │   │   │   │   └── 📁 [customerId]/
│       │   │   │   │       ├── 📄 page.tsx
│       │   │   │   │       └── 📁 edit/
│       │   │   │   │           └── 📄 page.tsx
│       │   │   │   │
│       │   │   │   ├── 📁 orders/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   ├── 📁 new/
│       │   │   │   │   │   └── 📄 page.tsx
│       │   │   │   │   └── 📁 [orderId]/
│       │   │   │   │       ├── 📄 page.tsx
│       │   │   │   │       └── 📁 details/
│       │   │   │   │           └── 📄 page.tsx
│       │   │   │   │
│       │   │   │   ├── 📁 business-units/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   ├── 📁 new/
│       │   │   │   │   │   └── 📄 page.tsx
│       │   │   │   │   └── 📁 [unitId]/
│       │   │   │   │       ├── 📄 page.tsx
│       │   │   │   │       ├── 📁 edit/
│       │   │   │   │       └── 📁 settings/
│       │   │   │   │
│       │   │   │   ├── 📁 staff/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   ├── 📁 new/
│       │   │   │   │   │   └── 📄 page.tsx
│       │   │   │   │   └── 📁 [staffId]/
│       │   │   │   │       ├── 📄 page.tsx
│       │   │   │   │       └── 📁 edit/
│       │   │   │   │
│       │   │   │   ├── 📁 roles/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   ├── 📁 new/
│       │   │   │   │   │   └── 📄 page.tsx
│       │   │   │   │   └── 📁 [roleId]/
│       │   │   │   │       ├── 📄 page.tsx
│       │   │   │   │       └── 📁 permissions/
│       │   │   │   │
│       │   │   │   ├── 📁 financial/
│       │   │   │   │   ├── 📄 page.tsx
│       │   │   │   │   ├── 📁 revenue/
│       │   │   │   │   └── 📁 expenses/
│       │   │   │   │
│       │   │   │   └── 📁 settings/
│       │   │   │       ├── 📄 page.tsx
│       │   │   │       ├── 📁 general/
│       │   │   │       ├── 📁 security/
│       │   │   │       └── 📁 audit-logs/
│       │   │   │
│       │   │   ├── 📁 sales/
│       │   │   │   ├── 📄 page.tsx
│       │   │   │   └── 📁 [saleId]/
│       │   │   │       └── 📄 page.tsx
│       │   │   │
│       │   │   ├── 📁 analytics/
│       │   │   │   ├── 📄 page.tsx
│       │   │   │   ├── 📁 reports/
│       │   │   │   └── 📁 trends/
│       │   │   │
│       │   │   └── 📁 profile/
│       │   │       ├── 📄 page.tsx
│       │   │       ├── 📁 settings/
│       │   │       │   └── 📄 page.tsx
│       │   │       └── 📁 password/
│       │   │           └── 📄 page.tsx
│       │   │
│       │   └── 📄 page.tsx
│       │
│       └── 📄 page.tsx
│
├── 📁 components/
│   ├── 📁 ui/
│   ├── 📁 layout/
│   ├── 📁 shared/
│   ├── 📁 forms/
│   ├── 📁 cards/
│   ├── 📁 pos/
│   ├── 📁 dashboard/
│   └── 📁 dynamic-renderers/        # NEW: Render based on permissions
│       ├── 📄 DynamicDashboard.tsx
│       ├── 📄 DynamicMenu.tsx
│       ├── 📄 DynamicFeatures.tsx
│       └── 📄 PermissionGate.tsx
│
├── 📁 lib/
│   ├── 📁 api/
│   │   ├── 📄 roleApi.ts
│   │   ├── 📄 permissionApi.ts
│   │   ├── 📄 businessUnitApi.ts
│   │   └── 📄 featureApi.ts
│   │
│   ├── 📁 auth/
│   │   ├── 📄 auth.ts
│   │   ├── 📄 role-validator.ts
│   │   ├── 📄 permission-checker.ts
│   │   └── 📄 dynamic-guards.ts
│   │
│   └── 📁 utils/
│       ├── 📄 role-utils.ts
│       ├── 📄 permission-utils.ts
│       ├── 📄 dynamic-route-builder.ts
│       └── 📄 feature-loader.ts
│
├── 📁 hooks/
│   ├── 📄 useRole.ts                 # Get role from URL
│   ├── 📄 useBusinessUnit.ts         # Get unit from URL
│   ├── 📄 usePermissions.ts          # Check permissions from DB
│   ├── 📄 useDynamicFeatures.ts      # Load available features
│   └── 📄 useDynamicNavigation.ts    # Generate menu from DB
│
├── 📁 store/
│   ├── 📁 api/
│   │   ├── 📄 roleApi.ts             # RTK Query - Fetch roles
│   │   ├── 📄 permissionApi.ts       # RTK Query - Fetch permissions
│   │   └── 📄 featureApi.ts          # RTK Query - Fetch features
│   │
│   └── 📁 slices/
│       ├── 📄 authSlice.ts
│       ├── 📄 roleSlice.ts
│       ├── 📄 permissionSlice.ts
│       └── 📄 featureSlice.ts
│
├── 📁 types/
│   ├── 📄 role.ts                    # Role type
│   ├── 📄 permission.ts              # Permission type
│   ├── 📄 feature.ts                 # Feature type
│   ├── 📄 businessUnit.ts
│   └── 📄 dynamic.ts
│
├── 📁 constants/
│   ├── 📄 features.ts                # All available features
│   └── 📄 permissions.ts             # Permission constants
│
└── 📄 middleware.ts                  # Dynamic role validation