# Signature Bangla POS Frontend

> [!CAUTION]
> **Project Status: Legacy & Inactive**
> This repository is no longer under active development. It represents an earlier version of the system that has since evolved into a modern architecture under the **Manoxen** project.

## Successor Project

This project has been succeeded and reimplemented as part of the **Manoxen Enterprise Platform**.

- **Successor:** [Manoxen](https://github.com/abdullahboshir/business-platform) (Private Monorepo)
- **Status:** Archived as historical and authorship proof.

---

A comprehensive Point of Sale (POS) system built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication & Authorization** - Role-based access control with JWT tokens
- 🏢 **Multi-Business Unit Support** - Manage multiple business units from a single dashboard
- 📊 **Dashboard** - Comprehensive dashboard with analytics, charts, and widgets
- 📦 **Inventory Management** - Track products, stock levels, and inventory
- 💰 **Sales & Purchases** - Manage sales transactions and purchase orders
- 👥 **Customer & Supplier Management** - Complete CRM functionality
- 📈 **Reports & Analytics** - Detailed reports and insights
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌓 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Redux Toolkit + RTK Query
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Authentication**: JWT-based auth with custom hooks

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (protected)/        # Protected routes
│   └── (public)/           # Public routes
├── components/             # React components
│   ├── dashboard/          # Dashboard components
│   ├── layouts/            # Layout components
│   ├── ui/                 # shadcn/ui components
│   └── modules/            # Feature modules
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and config
│   ├── auth/               # Authentication utilities
│   ├── axios/              # Axios configuration
│   └── providers/          # React providers
├── redux/                  # Redux store and APIs
│   ├── api/                # RTK Query API endpoints
│   └── store/              # Redux store configuration
├── services/               # API services
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd signature-bangla-pos-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:

```env
NEXT_PUBLIC_BACKEND_BASE_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_BASE_URL_LIVE=https://api.example.com/api/v1
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Backend API URLs
NEXT_PUBLIC_BACKEND_BASE_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_BASE_URL_LIVE=https://api.example.com/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=Signature Bangla POS
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Key Features

### Dashboard

- Overview statistics (Revenue, Orders, Products, Customers)
- Sales and revenue charts
- Recent orders widget
- Top products widget
- Quick actions based on user role

### Authentication

- JWT-based authentication
- Role-based access control
- Protected routes
- Token refresh mechanism

### Business Units

- Multi-business unit support
- Business unit switching
- Unit-specific dashboards

### Role-Based Access

- Super Admin - Full system access
- Business Admin - Business unit management
- Store Manager - Inventory and staff management
- Cashier - POS operations

## API Integration

The project uses Redux Toolkit Query (RTK Query) for API calls. All API endpoints are defined in `src/redux/api/`.

### Available APIs

- **Auth API** - Authentication endpoints
- **Admin API** - Admin operations
- **Customer API** - Customer management
- **Category API** - Category management
- **Product API** - Product management
- **Department API** - Department management
- **User API** - User profile and settings

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Submit a pull request

## License

Private - Signature Bangla
