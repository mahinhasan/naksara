# Comprehensive Setup & Operations Guide: Heritage E-Commerce

This guide provides step-by-step instructions for running, configuring, and deploying the Heritage Premium E-Commerce Platform.

---

## 1. System Requirements
- **Node.js**: 20.x or higher
- **PostgreSQL**: 15+ (Relational Database)
- **Redis**: 7+ (Caching & Background Jobs)
- **Docker & Docker Compose**: (Recommended for easy setup)

---

## 2. Quick Start (Docker)
The fastest way to get the entire stack running (Database, Redis, Backend, Frontend) is using Docker Compose.

### Option A: Using system Docker Compose
1. **Clone the project** to your local machine.
2. **Run Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

### Option B: Using Standalone Docker Compose (If Option A fails)
If you encounter errors like `ModuleNotFoundError: No module named 'distutils'`, use the following steps to download and use a standalone binary:
1. **Download the binary**:
   ```bash
   curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-$(uname -s)-$(uname -m)" -o ./docker-compose-v2
   chmod +x ./docker-compose-v2
   ```
2. **Run using the local binary**:
   ```bash
   ./docker-compose-v2 up -d --build
   ```

### 3. Initialize Database
After starting the containers, initialize the database:
```bash
# Using system docker-compose
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate

# OR using the standalone binary
./docker-compose-v2 exec backend npx prisma migrate deploy
./docker-compose-v2 exec backend npx prisma generate
```

4. **Access the Platform**:
   - Frontend: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`
   - Backend API: `http://localhost:4000`

---

## 3. Database Configuration
The platform uses **Prisma ORM** with **PostgreSQL**.

### Connection String
Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

### Initialization Commands
If running manually (without Docker):
1. **Apply Migrations**: `npx prisma migrate dev` (creates tables)
2. **Generate Client**: `npx prisma generate` (updates TypeScript types)
3. **Seed Data** (Optional): Create an initial admin user via the registration endpoint or a seed script.

---

## 4. Server Setup (Manual)

### Backend (NestJS)
1. **Navigate to backend**: `cd backend`
2. **Install Dependencies**: `npm install`
3. **Configure Environment**: Create `.env`
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/heritage"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="generate-a-strong-secret-here"
   PORT=4000
   ```
4. **Start Development**: `npm run start:dev`
5. **Production Build**: `npm run build && npm run start:prod`

### Frontend (Next.js)
1. **Navigate to frontend**: `cd frontend`
2. **Install Dependencies**: `npm install`
3. **Configure Environment**: Create `.env.local`
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   ```
4. **Start Development**: `npm run dev`
5. **Production Build**: `npm run build && npm start`

---

## 5. Admin & Permission Setup
The platform features a dynamic permission layer.

1. **Initial Admin**: Register a new user. Manually change their `role` to `ADMIN` in the database for the first time.
2. **Permission Matrix**: Navigate to `Admin -> Permissions` to define roles (e.g., "Warehouse Manager") and assign specific permissions like `UPDATE:Product` or `READ:Order`.
3. **Employee Assignment**: Go to `Admin -> Users` to assign these roles to employees.

---

## 6. Infrastructure & Marketing
- **Background Jobs**: BullMQ handles abandoned cart recovery and emails. Ensure Redis is running for these features.
- **Image Storage**: In production, configure AWS S3 in `backend/src/infrastructure/s3`.
- **SEO**: Robots.txt and Sitemap are automatically generated at `/robots.txt` and `/sitemap.xml`.

---

## 7. Security Best Practices
- **Rate Limiting**: Configured in `app.module.ts` to prevent brute force.
- **Audit Logs**: Every write operation is logged in the `AuditLog` table for security monitoring.
- **Passwords**: Hashed using Bcrypt with 10 salt rounds.
- **JWT**: Short-lived access tokens (15m) and long-lived refresh tokens (7d).
