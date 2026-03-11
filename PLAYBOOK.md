# Clowstack Technologies — Developer Playbook

Everything a new developer needs to know to clone this project and get it running.

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | v18+ |
| npm | v9+ |
| Git | any recent |
| PostgreSQL | v14+ (remote or local) |
| AWS S3 bucket | any region |

---

## 1. Clone & Install

```bash
git clone https://github.com/SLEM-Tech/clowstack-technologies.git
cd clowstack-technologies
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because the project uses both `react-query` v3 (customer-facing) and `@tanstack/react-query` v5 (admin panel) simultaneously.

---

## 2. Environment Variables

Create a `.env.local` file in the project root. **Never commit this file.**

```env
# ── App ──────────────────────────────────────────────────────
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ── PostgreSQL ────────────────────────────────────────────────
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=store_db
DB_USER=postgres
DB_PASSWORD=your_password

# ── AWS S3 ────────────────────────────────────────────────────
AWS_ACCESS_KEY=your_access_key_id
AWS_SECRET_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name

# ── JWT ───────────────────────────────────────────────────────
JWT_SECRET=a_long_random_secret_string

# ── Table prefix (must match what was used during DB init) ────
TABLE_PREFIX=clowstack_

# ── AlliancePay (payment gateway) ────────────────────────────
NEXT_PUBLIC_CHECKOUT_API=https://checkout-api-service-dev.eks-alliancepay.com
NEXT_PUBLIC_CHECKOUT_PUBLIC_KEY_API=your_alliancepay_public_key
NEXT_PUBLIC_ENCRYPTION_KEY=your_encryption_key
NEXT_PUBLIC_ENCRYPTION_BASE_URL=http://your-encryption-service/api

# ── Paystack (alternative payment) ───────────────────────────
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_live_...
```

### AWS S3 Bucket Setup

1. Create an S3 bucket (e.g. `your-bucket-name`)
2. Set bucket **ACL** to allow public read on uploaded objects, or use a bucket policy:
   ```json
   {
     "Effect": "Allow",
     "Principal": "*",
     "Action": "s3:GetObject",
     "Resource": "arn:aws:s3:::your-bucket-name/uploads/*"
   }
   ```
3. Create an IAM user with `AmazonS3FullAccess` (or scoped to your bucket) and copy its Access Key and Secret Key into `.env.local`.
4. Add **CORS** to the bucket so the browser can read uploaded URLs:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

---

## 3. First-Time Setup (in order)

Run these steps **once** after cloning. All endpoints are safe to re-run — they use `IF NOT EXISTS` / `ON CONFLICT DO NOTHING` throughout.

### Step 1 — Start the dev server

```bash
npm run dev
```

### Step 2 — Run the schema migration

```
GET http://localhost:3000/api/db/migrate?secret=init-db-2024
```

Creates all database tables with the `clowstack_` prefix. Source file: `src/lib/schema.sql`.

Tables created:
- `clowstack_users`
- `clowstack_categories`
- `clowstack_products`
- `clowstack_product_images`
- `clowstack_product_categories`
- `clowstack_product_attributes`
- `clowstack_orders`
- `clowstack_order_items`
- `clowstack_banners`
- `clowstack_global_settings`

Expected response:
```json
{ "message": "Schema applied successfully" }
```

### Step 3 — Seed the database with sample products

```
GET http://localhost:3000/api/db/seed?secret=seed-db-2024
```

Inserts sample data from `src/lib/seed.sql`:

| What | Count |
|------|-------|
| Parent categories | 8 (Smartphones, Laptops, Audio, Accessories, Smartwatches, Cameras, Gaming, Computer Accessories) |
| Sub-categories | 9 (Android Phones, iPhones & iPads, Laptops, Earbuds, Headphones, Speakers, Cases, Chargers, Power Banks) |
| Products | 22 (Samsung, Apple, Sony, Dell, HP, JBL, Logitech, GoPro, Tecno, Infinix, etc.) |
| Product images | 22 (one image per product, Unsplash URLs) |
| Product attributes | Color, Storage, Size, RAM variants on key products |

Expected response:
```json
{
  "message": "Database seeded successfully",
  "data": {
    "categories": "8 parent + 9 sub-categories inserted",
    "products": "22 products inserted",
    "images": "22 product images inserted",
    "attributes": "product variants (storage, color, size) inserted"
  }
}
```

### Step 4 — Create the super admin account

```
GET http://localhost:3000/api/admin/bootstrap?secret=clowstack-admin-2024
```

Creates the first admin user:

| Field | Value |
|-------|-------|
| Email | `admin@gmail.com` |
| Password | `admin` |
| Role | `admin` |

Expected response:
```json
{ "message": "Super admin created successfully", "admin": { ... } }
```

> **Change the default password immediately** after your first login at `/admin/login`.

---

### Full Setup — Quick Copy-Paste

Start the server, then open these four URLs in your browser (or use curl):

```bash
# 1. Migrate schema
curl "http://localhost:3000/api/db/migrate?secret=init-db-2024"

# 2. Seed sample products & categories
curl "http://localhost:3000/api/db/seed?secret=seed-db-2024"

# 3. Create super admin
curl "http://localhost:3000/api/admin/bootstrap?secret=clowstack-admin-2024"
```

Then log in at `http://localhost:3000/admin/login` with `admin@gmail.com` / `admin`.

---

## 4. Running the Project

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

Dev server runs at `http://localhost:3000`.

---

## 6. Key URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Customer storefront |
| `http://localhost:3000/admin/login` | Admin panel login |
| `http://localhost:3000/admin/dashboard` | Admin dashboard (requires login) |
| `http://localhost:3000/api/db/migrate?secret=init-db-2024` | Run schema migration (step 1 of setup) |
| `http://localhost:3000/api/db/seed?secret=seed-db-2024` | Seed sample products & categories (step 2) |
| `http://localhost:3000/api/admin/bootstrap?secret=clowstack-admin-2024` | Create super admin account (step 3) |

---

## 7. Project Structure

```
src/
├── app/
│   ├── (Home)/          # Storefront pages
│   ├── admin/           # Admin panel (login + protected dashboard)
│   │   ├── login/       # Admin login page
│   │   └── (protected)/ # Auth-guarded admin pages
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       ├── categories/
│   │       ├── customers/
│   │       ├── admins/
│   │       ├── banners/
│   │       └── settings/
│   └── api/
│       ├── admin/       # Admin API routes (cookie auth)
│       ├── customer/    # Customer auth & profile routes
│       ├── products/    # Public product routes
│       ├── order/       # Order routes
│       ├── category/    # Category routes
│       ├── media/       # File upload (customer-facing)
│       └── db/          # Schema migration endpoint
├── components/
│   ├── lib/
│   │   └── woocommerce.tsx   # Internal API client (replaces WooCommerce SDK)
│   └── set-up/redux/         # Redux store
├── lib/
│   ├── db.ts            # PostgreSQL pool
│   ├── auth.ts          # JWT + bcrypt helpers
│   ├── s3.ts            # AWS S3 upload
│   ├── tables.ts        # Table name registry (uses TABLE_PREFIX)
│   ├── schema.sql       # Full DB schema
│   └── productHelpers.ts # Hydrates DB rows into WooCommerce-compatible shape
utils/
├── endpoints.ts         # AlliancePay & Paystack API helpers
└── function.tsx         # Shared utility functions
```

---

## 8. Auth Overview

| Audience | Cookie | Token type |
|----------|--------|------------|
| Customers | `LOGIN_ACCESS` | JWT (Bearer, stored in localStorage) |
| Admins | `ADMIN_ACCESS` | JWT (httpOnly cookie) |

- Customer routes (`/api/customer/*`) require a `Bearer` token in the `Authorization` header.
- Admin routes (`/api/admin/*`) require the `ADMIN_ACCESS` httpOnly cookie set at login.
- Admin pages are guarded by a server component layout at `src/app/admin/(protected)/layout.tsx` — no middleware needed.

---

## 9. Image Uploads

- All product/banner images are uploaded to **AWS S3**.
- Customer-facing upload: `POST /api/media/upload` — requires Bearer token.
- Admin upload: `POST /api/admin/media/upload` — requires `ADMIN_ACCESS` cookie.
- Uploaded files land in the `uploads/` prefix of your S3 bucket.
- Public URL format: `https://{bucket}.s3.amazonaws.com/uploads/{timestamp}-{filename}`

---

## 10. Common Issues

| Problem | Fix |
|---------|-----|
| `npm install` fails with peer dep errors | Use `npm install --legacy-peer-deps` |
| Build error: `Can't resolve '../../_lib/requireAdmin'` | Clear `.next` cache: `rm -rf .next` and restart |
| Upload fails with "Unauthorized" | Make sure AWS keys are set in `.env.local` and S3 bucket has public read policy |
| Login works but redirects back to login | Check `JWT_SECRET` is set in `.env.local` |
| DB errors on first run | Visit `/api/db/migrate?secret=init-db-2024` to create tables first |
| Push rejected by GitHub (secret scanning) | Never hardcode credentials — use `.env.local` only |

---

## 11. Secrets Checklist Before Deploying

- [ ] `.env.local` is in `.gitignore` ✓
- [ ] AWS credentials are **not** hardcoded anywhere in source
- [ ] `JWT_SECRET` is set to a strong random string (not the default)
- [ ] Admin bootstrap and DB migrate endpoints are called once then noted as done
- [ ] Default admin password (`admin`) has been changed
- [ ] Paystack keys are switched from test (`pk_test_`) to live (`pk_live_`)
- [ ] AlliancePay keys are switched to production
