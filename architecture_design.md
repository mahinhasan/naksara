# Architecture Design: Premium E-Commerce Platform

## 1. High-Level Architecture
The system follows a **Modular Monolith** approach using NestJS, which allows for clean separation of concerns while keeping deployment simple. It is designed to be easily transitioned to Microservices if needed.

### Core Principles:
*   **Clean Architecture:** Separating Domain, Application, and Infrastructure layers.
*   **Domain-Driven Design (DDD):** Modeling the system around core business domains (Catalog, Order, Customer, Marketing).
*   **SOLID Principles:** Ensuring the codebase is maintainable and extensible.
*   **Event-Driven:** Using BullMQ for asynchronous tasks (emails, analytics, image processing).

---

## 2. Technology Stack Breakdown
*   **Frontend (Next.js 15+):** 
    *   App Router for optimized routing and layouts.
    *   SSR/ISR for SEO and fast initial loads.
    *   ShadCN UI & Tailwind for a premium, accessible UI.
    *   Zustand for lightweight client-side state (Cart, User session).
*   **Backend (NestJS):**
    *   TypeScript for type-safe development.
    *   Prisma ORM for database interaction.
    *   Passport.js with JWT for secure authentication.
*   **Database & Storage:**
    *   PostgreSQL: Primary relational storage.
    *   Redis: Caching and BullMQ queue management.
    *   AWS S3 + CloudFront: High-performance asset delivery.
*   **Security:**
    *   Rate Limiting (Throttler).
    *   Helmet for secure headers.
    *   CORS configuration.
    *   Bcrypt for password hashing.

---

## 3. Modular Structure (NestJS)
```text
src/
├── common/             # Shared utilities, decorators, filters
├── modules/
│   ├── auth/           # JWT, MFA, Password reset
│   ├── catalog/        # Products, Categories, Search (pgvector)
│   ├── orders/         # Cart, Checkout, Payments, Shipping
│   ├── customers/      # Profiles, Wishlist, Addresses
│   ├── loyalty/        # Points, Tiers, Referrals
│   ├── blog/           # Articles, SEO metadata
│   ├── marketing/      # Coupons, Abandoned Cart recovery
│   ├── analytics/      # Revenue, Sales reporting
│   └── admin/          # Management endpoints
├── infrastructure/     # S3, SES, Redis clients
└── main.ts
```

---

## 4. Performance & Scalability Strategy
*   **Caching:** Redis for high-frequency data (Product details, Category lists).
*   **Search Optimization:** PostgreSQL GIN indexes and pgvector for semantic search.
*   **Images:** Automatic WebP conversion and responsive resizing via CloudFront/S3.
*   **Background Jobs:** Offloading heavy tasks to BullMQ (Email campaigns, Analytics aggregation).
*   **Database Indexing:** B-Tree indexes on foreign keys and frequently filtered columns (Price, CategoryId).

---

## 5. Security Strategy
*   **Authentication:** JWT with Refresh Tokens (HttpOnly cookies).
*   **Authorization:** Dynamic RBAC (Role-Based Access Control). Roles and fine-grained permissions (e.g., `READ:Analytics`) are stored in the database and managed via the Admin Panel.
*   **Data Protection:** Input validation via Zod, SQLi protection via Prisma, XSS protection via Next.js sanitization.
*   **Auditing:** Logging all sensitive actions (Order creation, Profile changes, Admin logins) in an Audit Log table.
