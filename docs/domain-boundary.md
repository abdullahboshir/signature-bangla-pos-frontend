# Domain Boundaries

## Contacts vs. Customers

To maintain a clean separation of concerns between CRM (Relationship Management) and Commerce (Shopping Behavior), we strictly define the following domain boundaries:

### 1. Contacts (`/contacts`)
**Domain:** CRM (Customer Relationship Management) & Identity
**Purpose:** Manages the *identity* and *relationship* aspect of people and organizations.
**Entities:**
- **Customer List (CRM View):** Basic contact info, interaction history, lead status.
- **Suppliers:** Vendors and B2B partners.
- **Leads:** Potential customers.

**Key Features:**
- Contact details (Name, Email, Phone, Address)
- Interaction logs (Calls, Meetings)
- KYC documents
- B2B relationships

### 2. Customers (`/customers`)
**Domain:** Commerce & Shopping Behavior
**Purpose:** Manages the *transactional* and *shopping* aspect of users.
**Entities:**
- **Carts:** Active and abandoned shopping carts.
- **Wishlists:** Saved products.
- **Subscriptions:** Recurring billing profiles.
- **Loyalty:** Points, rewards, tier status.
- **Reviews:** Product reviews and ratings.

**Key Distinction:**
- If you need to know **"Who is this person?"**, go to **Contacts**.
- If you need to know **"What are they buying?"**, go to **Customers**.

### 3. POS vs. Sales
**Domain:** Transaction Origin vs. Lifecycle
**Purpose:** Distinguish between the point of capture and the management of orders.
**Rule:**
- **POS (`/pos`):** Creates orders (Point of Sale). Focus is on speed, terminal management, and cash handling.
- **Sales (`/sales`):** Manages order lifecycle (Fulfillment, Returns, Invoices, Shipping). Focus is on processing and history.

### 4. System Scope (`/system`)
**Domain:** Platform Integrity vs. Business Customization
**Purpose:** Ensure security and compliance data remains separate from operational settings.
**Rule:**
- **Platform/System (`global/system`):** Owns sensitive infrastructure data.
  - API Keys
  - Backups
  - Audit Logs (Global)
  - Data Retention Policies
- **Business/System (`[business-unit]/system`):** Owns operational configuration.
  - Notifications
  - Email/SMS Templates
  - Currencies & Zones

### 5. Settings Ownership
**Domain:** Routing vs. Logic
**Purpose:** Keep dashboard pages lightweight and focused on layout/routing.
**Rule:**
- **App/Route (`(dashboard)/business-settings`):** Routing only. Should import components.
- **Modules (`modules/settings`):** Logic and UI. All actual form implementations reside here.

