# Kingdom Threads

Kingdom Threads is a full-stack custom apparel ecommerce platform that allows customers to personalize clothing and accessories through an interactive browser-based designer and place orders online.

The application combines product browsing, multi-view product customization, guest and authenticated shopping flows, persistent design state, international currency display, order management, cloud storage, and transactional email infrastructure.

> **Status:** Active development toward production deployment.

## Features

### Interactive Product Designer

- Browser-based customization powered by Fabric.js
- Front, back, left, and right product views where supported
- Product-specific color and view availability
- Custom text with typography controls
- Customer artwork uploads
- Move, resize, rotate, and remove design elements
- Independent design state for each product view
- Generated previews for customized products
- Persistent editing of saved designs

### Customizable Products

The customization architecture supports multiple apparel and accessory types, including:

- Classic T-Shirts
- Oversized T-Shirts
- Polo Shirts
- Hoodies
- Zip Hoodies
- Oversized Hoodies
- Caps

Each product exposes only the colors and views supported by its available mockup assets.

### Shopping Experience

- Customizable product catalogue
- Ready-made product catalogue
- Product color and size selection
- Persistent shopping cart
- Quantity management
- Guest checkout
- Authenticated checkout
- Delivery fee calculation
- Country selection
- Live currency conversion for display

### Authentication & Persistence

Supabase provides authentication and cloud persistence.

Authenticated customers can save designs and access account-related functionality, while guest customers can customize products and place orders without being required to create an account.

Guest design state is temporarily persisted in IndexedDB and transferred to permanent cloud storage when an order is placed.

### Orders

The order workflow includes:

- Order and order-item persistence in PostgreSQL
- Unique order references
- Customized product metadata
- Per-view design previews
- Permanent storage of uploaded customer artwork
- Guest and authenticated orders
- Transactional order confirmation infrastructure

### Transactional Email

Order confirmation email delivery is implemented using a Supabase Edge Function and Resend.

Sensitive email credentials remain server-side as Supabase secrets and are never exposed to the React client.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Fabric.js
- Lucide React
- IndexedDB

### Backend & Infrastructure

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security (RLS)
- Supabase Edge Functions
- Resend

### Additional Services

- Frankfurter API for live exchange-rate data
- `countries-list` for international country and currency metadata

## Architecture

```text
                    ┌─────────────────────┐
                    │    React Client     │
                    │ TypeScript + Vite   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      Fabric.js Designer   IndexedDB        Supabase Client
                                                   │
                                  ┌────────────────┼───────────────┐
                                  │                │               │
                                  ▼                ▼               ▼
                            PostgreSQL          Storage           Auth
                                  │
                                  ▼
                         Supabase Edge Functions
                                  │
                                  ▼
                               Resend
```

## Project Structure

```text
kingdom-threads/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── .env.example
│   └── package.json
│
├── supabase/
│   ├── functions/
│   │   └── send-order-confirmation/
│   └── config.toml
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

The frontend and Supabase tooling are intentionally separated. The root package configuration manages local Supabase CLI tooling, while `frontend/package.json` manages the React application.

## Getting Started

### Prerequisites

- Node.js
- npm
- A Supabase project

### Installation

Clone the repository:

```bash
git clone https://github.com/deborahf2911/kingdom-threads.git
cd kingdom-threads
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Create your local environment file from the example:

```bash
cp .env.example .env
```

Configure:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

## Production Build

Create a production build with:

```bash
npm run build
```

Run static analysis with:

```bash
npm run lint
```

## Supabase Edge Functions

Supabase CLI tooling is managed from the repository root.

Install the root dependencies:

```bash
npm install
```

The transactional email function is located at:

```text
supabase/functions/send-order-confirmation/
```

Server-side credentials such as the Resend API key are configured using Supabase secrets and are not stored in this repository.

## Security

The application is designed around several security boundaries:

- Supabase Row Level Security protects database access
- Storage access is controlled through bucket policies
- Private credentials are kept out of the frontend
- Resend credentials are stored as Supabase server-side secrets
- Guest checkout is supported without exposing authenticated-user data
- Environment files and local Supabase metadata are excluded from source control

## Current Development

Current development work includes:

- Expanding customizable product mockups and variants
- Improving responsive behavior across the customization experience
- Optimizing product assets and application bundle size
- Completing production-ready international delivery rules
- Expanding transactional order email content
- Preparing production domain and deployment infrastructure

## Screenshots

Project screenshots and a deployed demonstration will be added as the production UI is finalized.

## Author

**Deborah Fernando**

Full-stack web application project built with React, TypeScript, Fabric.js, and Supabase.