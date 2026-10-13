# SVS FRESH JUICE POINT – Supabase Backend & Owner Dashboard Setup Guide

This document provides step-by-step instructions for provisioning, configuring, and deploying the Supabase backend and private owner dashboard for **SVS FRESH JUICE POINT – நம்ம நுங்கு கடை**.

---

## 1. Prerequisites

- A Supabase account ([supabase.com](https://supabase.com))
- Node.js 18+ and npm installed
- Git

---

## 2. Step 1: Create a Supabase Project

1. Log in to [Supabase Dashboard](https://app.supabase.com).
2. Click **New Project**.
3. Choose an Organization, Project Name (e.g., `svs-fresh-juice-point`), and Database Password.
4. Select the region nearest to your customers (e.g., `ap-south-1` Mumbai for India).
5. Wait for the project to provision.

---

## 3. Step 2: Retrieve API Credentials

In your Supabase project dashboard:
1. Navigate to **Project Settings** -> **API**.
2. Note down:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon / public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role secret key** (`SUPABASE_SERVICE_ROLE_KEY`) — *Keep this strictly confidential; never share or commit!*

---

## 4. Step 3: Run Database Migrations

In the Supabase Dashboard, open the **SQL Editor** and run the migration scripts located in this repository:

### Migration 01: Initial Schema & RLS Policies
Copy and paste the entire contents of:
`supabase/migrations/20261013000001_initial_schema.sql`
Click **Run**.

This migration creates:
- `profiles` table referencing `auth.users`
- `is_owner(user_id)` helper function
- `categories` table
- `products` table
- `product_price_history` table (audit log with effective timestamp)
- `products_with_current_price` view
- `delivery_rules` table (distance tiers & thresholds)
- `orders` table (with status tracking, pricing status, applied delivery snapshots)
- `order_items` table (immutable name and unit price snapshots)
- `create_order_transaction` PostgreSQL function (atomic order creation)
- Row Level Security (RLS) policies on all tables

### Migration 02: Seed Initial Catalog & Default Delivery Rules
Copy and paste the entire contents of:
`supabase/migrations/20261013000002_seed_data.sql`
Click **Run**.

This migration seeds:
- All 7 categories (Nungu & Ilaneer, Fresh Fruit Ice Creams, Sarbath & Soda, Milk Shake, Fresh Juices, Sharja, Omlete)
- All 53 authentic products with existing names, descriptions, images, and prices
- Initial price history in integer paise
- Default delivery rules (0–3 km: ₹30, 3–5 km: ₹60, Free above ₹1,000 subtotal)

---

## 5. Step 4: Bootstrap the Initial Shop Owner

To grant owner dashboard access securely without self-elevation:

1. In Supabase Dashboard, go to **Authentication** -> **Users** -> Click **Add User** -> **Create User**.
2. Enter the owner email (e.g., `owner@svsjuice.com`) and a strong password. Confirm email automatically.
3. Once created, copy the user's **User UID**.
4. In the **SQL Editor**, execute:

```sql
INSERT INTO public.profiles (id, full_name, role)
VALUES ('PASTE-USER-UID-HERE', 'Shop Owner', 'owner')
ON CONFLICT (id) DO UPDATE SET role = 'owner';
```

Now this user is authorized as `owner` and can log into `/admin/login`.

---

## 6. Step 5: Configure Local Environment Variables

1. In the project root, copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Populate the keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_WHATSAPP_NUMBER=9442478101
   ```

---

## 7. Step 6: Run and Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Visit `http://localhost:3000` to verify customer storefront.
3. Visit `http://localhost:3000/admin/login` to log in as the owner:
   - Review incoming orders at `/admin/orders`
   - Update daily fruit prices at `/admin/products`
   - Adjust delivery rules at `/admin/settings/delivery`

---

## 8. Step 7: Production Deployment

When deploying to Vercel, Netlify, or another host:

1. Add the environment variables in your hosting provider's dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
2. Deploy the build:
   ```bash
   npm run build
   ```
3. Test end-to-end:
   - Place a test order through the customer checkout
   - Verify the order appears in the database and owner dashboard
   - Verify WhatsApp opens with the generated order number
   - Update a fruit price in the owner dashboard and verify it reflects on the customer menu immediately without redeployment
