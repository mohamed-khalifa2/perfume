-- =============================================================================
-- Maison Noir — Luxury Perfume House
-- Full database schema, RLS policies, storage and seed data.
--
-- Run in the Supabase SQL editor (or `supabase db push`).
-- The script is idempotent: safe to re-run.
--
-- Currency: EGP. All money columns are numeric(12,2).
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- -----------------------------------------------------------------------------

do $$
begin
  create type public.product_gender as enum ('men', 'women', 'unisex');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.product_concentration as enum ('EDP', 'EDT', 'Parfum', 'Extrait');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.coupon_type as enum ('percent', 'fixed');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_method as enum ('cod', 'paymob');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum ('new', 'confirmed', 'shipped', 'delivered', 'cancelled');
exception when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- 2. TABLES
-- -----------------------------------------------------------------------------

-- Single-row tables: `id boolean primary key default true` + check (id)
-- guarantees exactly one row can ever exist.

create table if not exists public.site_settings (
  id                      boolean primary key default true,
  store_name              text        not null default 'Maison Noir',
  tagline                 text,
  logo_url                text,
  email                   text,
  phone                   text,
  whatsapp                text,
  address                 text,
  instagram               text,
  facebook                text,
  tiktok                  text,
  footer_text             text,
  free_shipping_threshold numeric(12,2),
  seo_title               text,
  seo_description         text,
  constraint site_settings_single_row check (id)
);

create table if not exists public.hero (
  id           boolean primary key default true,
  headline     text not null,
  subheadline  text,
  image_url    text,
  cta_label    text,
  cta_link     text,
  constraint hero_single_row check (id)
);

create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  sort_order  int  not null default 0,
  is_visible  boolean not null default true
);

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  brand        text,
  description  text,
  gender       public.product_gender not null default 'unisex',
  concentration public.product_concentration not null default 'EDP',
  top_notes    text[] not null default '{}',
  heart_notes  text[] not null default '{}',
  base_notes   text[] not null default '{}',
  scent_family text,
  cover_image_url text,
  is_featured  boolean not null default false,
  is_new       boolean not null default false,
  is_visible   boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.product_variants (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products (id) on delete cascade,
  size_ml          int not null check (size_ml > 0),
  price            numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= 0),
  stock            int not null default 0 check (stock >= 0),
  sku              text not null unique,
  constraint product_variants_unique_size unique (product_id, size_ml)
);

create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url  text not null,
  sort_order int not null default 0,
  constraint product_images_unique_image unique (product_id, image_url)
);

create table if not exists public.product_collections (
  product_id   uuid not null references public.products (id) on delete cascade,
  collection_id uuid not null references public.collections (id) on delete cascade,
  constraint product_collections_pkey primary key (product_id, collection_id)
);

create table if not exists public.shipping_zones (
  id          uuid primary key default gen_random_uuid(),
  governorate text not null unique,
  fee         numeric(12,2) not null default 0 check (fee >= 0),
  is_active   boolean not null default true
);

create table if not exists public.coupons (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  type       public.coupon_type not null,
  value      numeric(12,2) not null check (value > 0),
  min_order  numeric(12,2),
  max_uses   int,
  used_count int not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  is_active  boolean not null default true
);

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique,
  customer_name   text not null,
  email           text not null,
  phone           text not null,
  governorate     text not null,
  city            text,
  address         text not null,
  notes           text,
  payment_method  public.payment_method not null default 'cod',
  payment_status  public.payment_status not null default 'pending',
  status          public.order_status not null default 'new',
  subtotal        numeric(12,2) not null default 0 check (subtotal >= 0),
  shipping_fee    numeric(12,2) not null default 0 check (shipping_fee >= 0),
  discount        numeric(12,2) not null default 0 check (discount >= 0),
  total           numeric(12,2) not null default 0 check (total >= 0),
  coupon_code     text,
  paymob_order_id text,
  created_at      timestamptz not null default now()
);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid references public.products (id) on delete set null,
  variant_id   uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  size_ml      int not null,
  unit_price   numeric(12,2) not null check (unit_price >= 0),
  quantity     int not null check (quantity > 0),
  image_url    text
);

create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  created_at timestamptz not null default now(),
  is_read    boolean not null default false
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.login_attempts (
  id         bigint generated always as identity primary key,
  ip         text not null,
  created_at timestamptz not null default now()
);

-- Human readable order numbers: PF-100245, PF-100246, ...
create sequence if not exists public.order_number_seq start with 100245 increment by 1;

-- -----------------------------------------------------------------------------
-- 3. INDEXES
-- -----------------------------------------------------------------------------

create index if not exists products_visible_sort_idx on public.products (is_visible, sort_order);
create index if not exists products_featured_idx on public.products (is_featured) where is_featured;
create index if not exists collections_visible_sort_idx on public.collections (is_visible, sort_order);
create index if not exists product_variants_product_idx on public.product_variants (product_id);
create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);
create index if not exists product_collections_collection_idx on public.product_collections (collection_id);
create index if not exists shipping_zones_governorate_idx on public.shipping_zones (lower(governorate));
create index if not exists coupons_code_idx on public.coupons (upper(code));
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists login_attempts_ip_idx on public.login_attempts (ip, created_at desc);

-- -----------------------------------------------------------------------------
-- 4. FUNCTIONS
-- -----------------------------------------------------------------------------

-- True when the current user (auth.uid()) is listed in public.admins.
-- SECURITY DEFINER so the check is not blocked by the RLS policies on `admins`.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- create_order
--   Creates an order from a client supplied cart.
--
--   The client only sends { variant_id, quantity } pairs plus customer details.
--   Every price, discount and shipping fee is read from the database inside this
--   function — client supplied amounts are never trusted.
--
--   The whole function body runs inside a single transaction (a PL/pgSQL
--   function call is atomic): variant rows are locked FOR UPDATE, stock is
--   decremented, the coupon is validated and used, and the order + items are
--   written. Any error rolls everything back.
--
--   Returns jsonb:
--     { order_id, order_number, subtotal, shipping_fee, discount, total,
--       payment_method, status }
--
--   Raises:
--     CART_EMPTY, INVALID_QUANTITY, VARIANT_NOT_FOUND, PRODUCT_UNAVAILABLE,
--     OUT_OF_STOCK, INVALID_COUPON, COUPON_MIN_ORDER, INVALID_GOVERNORATE,
--     INVALID_PAYMENT_METHOD, INVALID_CUSTOMER, INVALID_ADDRESS
-- -----------------------------------------------------------------------------
create or replace function public.create_order(
  p_items          jsonb,
  p_customer_name  text,
  p_email          text,
  p_phone          text,
  p_governorate    text,
  p_city           text default null,
  p_address        text default null,
  p_notes          text default null,
  p_coupon_code    text default null,
  p_payment_method text default 'cod'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item        jsonb;
  v_item_rows   jsonb := '[]'::jsonb;
  v_variant_id  uuid;
  v_quantity    int;
  v_row         record;
  v_coupon      record;
  v_coupon_code text;
  v_subtotal    numeric(12,2) := 0;
  v_shipping    numeric(12,2) := 0;
  v_discount    numeric(12,2) := 0;
  v_total       numeric(12,2) := 0;
  v_free_shipping numeric(12,2);
  v_order_id    uuid;
  v_order_number text;
  v_payment_method text;
begin
  -- ---------------------------------------------------------------------------
  -- Validation
  -- ---------------------------------------------------------------------------
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'CART_EMPTY: Your cart is empty.' using errcode = 'P0001';
  end if;

  if p_payment_method is null or lower(btrim(p_payment_method)) not in ('cod', 'paymob') then
    raise exception 'INVALID_PAYMENT_METHOD: Payment method must be cod or paymob.' using errcode = 'P0001';
  end if;

  v_payment_method := lower(btrim(p_payment_method));

  if p_customer_name is null or btrim(p_customer_name) = '' then
    raise exception 'INVALID_CUSTOMER: Customer name is required.' using errcode = 'P0001';
  end if;

  if p_email is null or btrim(p_email) !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'INVALID_CUSTOMER: A valid email address is required.' using errcode = 'P0001';
  end if;

  if p_phone is null or btrim(p_phone) !~ '^[0-9+\-() ]{6,20}$' then
    raise exception 'INVALID_CUSTOMER: A valid phone number is required.' using errcode = 'P0001';
  end if;

  if p_governorate is null or btrim(p_governorate) = '' then
    raise exception 'INVALID_GOVERNORATE: Governorate is required.' using errcode = 'P0001';
  end if;

  if p_address is null or btrim(p_address) = '' then
    raise exception 'INVALID_ADDRESS: Delivery address is required.' using errcode = 'P0001';
  end if;

  -- ---------------------------------------------------------------------------
  -- Line items: read the real price, lock the row, check the stock
  -- ---------------------------------------------------------------------------
  for v_item in select value from jsonb_array_elements(p_items) as j(value)
  loop
    if jsonb_typeof(v_item) <> 'object' then
      raise exception 'VARIANT_NOT_FOUND: One of the selected items is no longer available.' using errcode = 'P0001';
    end if;

    if coalesce(v_item ->> 'variant_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      raise exception 'VARIANT_NOT_FOUND: One of the selected items is no longer available.' using errcode = 'P0001';
    end if;

    if coalesce(v_item ->> 'quantity', '') !~ '^[0-9]{1,4}$' then
      raise exception 'INVALID_QUANTITY: Quantity must be a positive whole number.' using errcode = 'P0001';
    end if;

    v_variant_id := (v_item ->> 'variant_id')::uuid;
    v_quantity  := (v_item ->> 'quantity')::int;

    if v_quantity <= 0 then
      raise exception 'INVALID_QUANTITY: Quantity must be at least 1.' using errcode = 'P0001';
    end if;

    select
      pv.id,
      pv.product_id,
      pv.size_ml,
      pv.price,
      pv.stock,
      p.name,
      p.cover_image_url,
      p.is_visible
    into v_row
    from public.product_variants pv
    join public.products p on p.id = pv.product_id
    where pv.id = v_variant_id
    for update of pv;

    if not found then
      raise exception 'VARIANT_NOT_FOUND: One of the selected items is no longer available.' using errcode = 'P0001';
    end if;

    if not v_row.is_visible then
      raise exception 'PRODUCT_UNAVAILABLE: % is no longer available.', v_row.name using errcode = 'P0001';
    end if;

    if v_row.stock < v_quantity then
      raise exception 'OUT_OF_STOCK: % (% ml) is out of stock.', v_row.name, v_row.size_ml using errcode = 'P0001';
    end if;

    v_subtotal := v_subtotal + (v_row.price * v_quantity);

    v_item_rows := v_item_rows || jsonb_build_array(
      jsonb_build_object(
        'product_id',   v_row.product_id,
        'variant_id',   v_row.id,
        'product_name', v_row.name,
        'size_ml',      v_row.size_ml,
        'unit_price',   v_row.price,
        'quantity',     v_quantity,
        'image_url',    v_row.cover_image_url
      )
    );

    -- Stock is decremented while the row lock is held.
    update public.product_variants
    set stock = stock - v_quantity
    where id = v_row.id;
  end loop;

  -- ---------------------------------------------------------------------------
  -- Coupon
  -- ---------------------------------------------------------------------------
  if p_coupon_code is not null and btrim(p_coupon_code) <> '' then
    v_coupon_code := upper(btrim(p_coupon_code));

    select * into v_coupon
    from public.coupons
    where upper(code) = v_coupon_code
      and is_active
      and (expires_at is null or expires_at > now())
      and (max_uses is null or used_count < max_uses)
    for update;

    if not found then
      raise exception 'INVALID_COUPON: The coupon code % is not valid.', v_coupon_code using errcode = 'P0001';
    end if;

    if v_coupon.min_order is not null and v_subtotal < v_coupon.min_order then
      raise exception 'COUPON_MIN_ORDER: This coupon requires a minimum order of EGP %.', v_coupon.min_order using errcode = 'P0001';
    end if;

    if v_coupon.type = 'percent' then
      v_discount := round(v_subtotal * v_coupon.value / 100, 2);
    else
      v_discount := round(least(v_coupon.value, v_subtotal), 2);
    end if;

    update public.coupons
    set used_count = used_count + 1
    where id = v_coupon.id;
  end if;

  -- ---------------------------------------------------------------------------
  -- Shipping
  -- ---------------------------------------------------------------------------
  select sz.fee into v_shipping
  from public.shipping_zones sz
  where lower(sz.governorate) = lower(btrim(p_governorate))
    and sz.is_active;

  if not found then
    raise exception 'INVALID_GOVERNORATE: We do not ship to % yet.', p_governorate using errcode = 'P0001';
  end if;

  select ss.free_shipping_threshold into v_free_shipping
  from public.site_settings ss
  where ss.id = true;

  if v_free_shipping is not null and (v_subtotal - v_discount) >= v_free_shipping then
    v_shipping := 0;
  end if;

  v_total := round(v_subtotal - v_discount + v_shipping, 2);

  -- ---------------------------------------------------------------------------
  -- Persist
  -- ---------------------------------------------------------------------------
  v_order_number := 'PF-' || lpad(nextval('public.order_number_seq')::text, 6, '0');

  insert into public.orders (
    order_number, customer_name, email, phone, governorate, city, address, notes,
    payment_method, payment_status, status, subtotal, shipping_fee, discount, total, coupon_code
  )
  values (
    v_order_number, btrim(p_customer_name), lower(btrim(p_email)), btrim(p_phone),
    btrim(p_governorate), nullif(btrim(p_city), ''), nullif(btrim(p_address), ''), nullif(btrim(p_notes), ''),
    v_payment_method::public.payment_method, 'pending', 'new',
    round(v_subtotal, 2), round(v_shipping, 2), round(v_discount, 2), v_total, v_coupon_code
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, variant_id, product_name, size_ml, unit_price, quantity, image_url
  )
  select
    v_order_id,
    (i.item ->> 'product_id')::uuid,
    (i.item ->> 'variant_id')::uuid,
    i.item ->> 'product_name',
    (i.item ->> 'size_ml')::int,
    (i.item ->> 'unit_price')::numeric,
    (i.item ->> 'quantity')::int,
    i.item ->> 'image_url'
  from jsonb_array_elements(v_item_rows) as i(item);

  return jsonb_build_object(
    'order_id',       v_order_id,
    'order_number',   v_order_number,
    'subtotal',       round(v_subtotal, 2),
    'shipping_fee',   round(v_shipping, 2),
    'discount',       round(v_discount, 2),
    'total',          v_total,
    'payment_method', v_payment_method,
    'status',         'new'
  );
end;
$$;

revoke execute on function public.create_order(jsonb, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.create_order(jsonb, text, text, text, text, text, text, text, text, text) to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

alter table public.site_settings     enable row level security;
alter table public.hero              enable row level security;
alter table public.collections       enable row level security;
alter table public.products          enable row level security;
alter table public.product_variants  enable row level security;
alter table public.product_images    enable row level security;
alter table public.product_collections enable row level security;
alter table public.shipping_zones    enable row level security;
alter table public.coupons           enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.inquiries         enable row level security;
alter table public.admins            enable row level security;
alter table public.login_attempts    enable row level security;

-- --- Public read: site settings -------------------------------------------
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Public read: hero ----------------------------------------------------
drop policy if exists "hero public read" on public.hero;
create policy "hero public read" on public.hero
  for select to anon, authenticated using (true);

drop policy if exists "hero admin write" on public.hero;
create policy "hero admin write" on public.hero
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Public read: visible collections -------------------------------------
drop policy if exists "collections public read" on public.collections;
create policy "collections public read" on public.collections
  for select to anon, authenticated using (is_visible);

drop policy if exists "collections admin write" on public.collections;
create policy "collections admin write" on public.collections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Public read: visible products ----------------------------------------
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select to anon, authenticated using (is_visible);

drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Public read: variants of visible products ----------------------------
drop policy if exists "product_variants public read" on public.product_variants;
create policy "product_variants public read" on public.product_variants
  for select to anon, authenticated using (
    exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and p.is_visible
    )
  );

drop policy if exists "product_variants admin write" on public.product_variants;
create policy "product_variants admin write" on public.product_variants
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Public read: images of visible products ------------------------------
drop policy if exists "product_images public read" on public.product_images;
create policy "product_images public read" on public.product_images
  for select to anon, authenticated using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.is_visible
    )
  );

drop policy if exists "product_images admin write" on public.product_images;
create policy "product_images admin write" on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Public read: product <-> collection links ----------------------------
drop policy if exists "product_collections public read" on public.product_collections;
create policy "product_collections public read" on public.product_collections
  for select to anon, authenticated using (
    exists (
      select 1 from public.products p
      where p.id = product_collections.product_id and p.is_visible
    )
  );

drop policy if exists "product_collections admin write" on public.product_collections;
create policy "product_collections admin write" on public.product_collections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Public read: active shipping zones -----------------------------------
drop policy if exists "shipping_zones public read" on public.shipping_zones;
create policy "shipping_zones public read" on public.shipping_zones
  for select to anon, authenticated using (is_active);

drop policy if exists "shipping_zones admin write" on public.shipping_zones;
create policy "shipping_zones admin write" on public.shipping_zones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Coupons: no public access (validated inside create_order) -------------
drop policy if exists "coupons admin read" on public.coupons;
create policy "coupons admin read" on public.coupons
  for select to authenticated using (public.is_admin());

drop policy if exists "coupons admin write" on public.coupons;
create policy "coupons admin write" on public.coupons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Orders: no public access, admin only ---------------------------------
drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read" on public.orders
  for select to authenticated using (public.is_admin());

drop policy if exists "orders admin write" on public.orders;
create policy "orders admin write" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Order items: no public access, admin only -----------------------------
drop policy if exists "order_items admin read" on public.order_items;
create policy "order_items admin read" on public.order_items
  for select to authenticated using (public.is_admin());

drop policy if exists "order_items admin write" on public.order_items;
create policy "order_items admin write" on public.order_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Inquiries: public INSERT only, admin full access ----------------------
drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert" on public.inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "inquiries admin read" on public.inquiries;
create policy "inquiries admin read" on public.inquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "inquiries admin write" on public.inquiries;
create policy "inquiries admin write" on public.inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Admins: no public access ---------------------------------------------
drop policy if exists "admins admin read" on public.admins;
create policy "admins admin read" on public.admins
  for select to authenticated using (public.is_admin());

drop policy if exists "admins admin write" on public.admins;
create policy "admins admin write" on public.admins
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- Login attempts: no public access (written by the server) --------------
drop policy if exists "login_attempts admin read" on public.login_attempts;
create policy "login_attempts admin read" on public.login_attempts
  for select to authenticated using (public.is_admin());

drop policy if exists "login_attempts admin write" on public.login_attempts;
create policy "login_attempts admin write" on public.login_attempts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. GRANTS
-- -----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

-- Content tables: the public can read them, authenticated admins can write them.
-- RLS decides which rows are visible.
grant select on public.site_settings, public.hero, public.collections, public.products,
  public.product_variants, public.product_images, public.product_collections,
  public.shipping_zones, public.inquiries to anon, authenticated;

grant insert on public.inquiries to anon, authenticated;

grant all on public.site_settings, public.hero, public.collections, public.products,
  public.product_variants, public.product_images, public.product_collections,
  public.shipping_zones, public.inquiries to authenticated;

-- Sensitive tables: anon has no privileges at all, authenticated only gets what
-- the admin policies allow. Orders are written through create_order() only.
revoke all on public.orders, public.order_items, public.coupons, public.admins, public.login_attempts from anon;

grant all on public.orders, public.order_items, public.coupons, public.admins, public.login_attempts to authenticated;

grant all on public.orders, public.order_items, public.coupons, public.admins, public.login_attempts to service_role;

-- -----------------------------------------------------------------------------
-- 7. STORAGE — public bucket "site-media", public read, admin only write
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site-media public read" on storage.objects;
create policy "site-media public read" on storage.objects
  for select to public using (bucket_id = 'site-media');

drop policy if exists "site-media admin insert" on storage.objects;
create policy "site-media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "site-media admin update" on storage.objects;
create policy "site-media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "site-media admin delete" on storage.objects;
create policy "site-media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());

-- -----------------------------------------------------------------------------
-- 8. SEED DATA
-- -----------------------------------------------------------------------------

-- --- Site settings ---------------------------------------------------------
insert into public.site_settings (
  id, store_name, tagline, logo_url, email, phone, whatsapp, address,
  instagram, facebook, tiktok, footer_text, free_shipping_threshold,
  seo_title, seo_description
)
values (
  true,
  'Maison Noir',
  'Fragrance, composed.',
  'https://picsum.photos/seed/maison-noir-logo/200/200',
  'hello@maisonnoir.eg',
  '+20 10 1234 5678',
  '+201012345678',
  '12 Talaat Harb Street, Downtown, Cairo, Egypt',
  'https://instagram.com/maisonnoir',
  'https://facebook.com/maisonnoir',
  'https://tiktok.com/@maisonnoir',
  'Maison Noir — composed in Cairo, shipped across Egypt.',
  3000,
  'Maison Noir — Luxury Perfume House in Egypt',
  'Small-batch eaux de parfum and extraits, blended in Cairo and shipped across Egypt. Cash on delivery available.'
)
on conflict (id) do update set
  store_name = excluded.store_name,
  tagline = excluded.tagline,
  logo_url = excluded.logo_url,
  email = excluded.email,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  address = excluded.address,
  instagram = excluded.instagram,
  facebook = excluded.facebook,
  tiktok = excluded.tiktok,
  footer_text = excluded.footer_text,
  free_shipping_threshold = excluded.free_shipping_threshold,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- --- Hero ------------------------------------------------------------------
insert into public.hero (id, headline, subheadline, image_url, cta_label, cta_link)
values (
  true,
  'Fragrance, composed.',
  'Small-batch eaux de parfum, blended in Cairo and shipped across Egypt.',
  'https://picsum.photos/seed/maison-noir-hero/1920/1080',
  'Shop the collection',
  '/shop'
)
on conflict (id) do update set
  headline = excluded.headline,
  subheadline = excluded.subheadline,
  image_url = excluded.image_url,
  cta_label = excluded.cta_label,
  cta_link = excluded.cta_link;

-- --- Collections (4) -------------------------------------------------------
insert into public.collections (name, slug, description, image_url, sort_order, is_visible)
select v.name, v.slug, v.description, v.image_url, v.sort_order, true
from (values
  ('Men',            'men',          'Compositions for him — oud, leather, tobacco and smoke.', 'https://picsum.photos/seed/collection-men/1200/1500', 1),
  ('Women',          'women',        'Florals, resins and soft musks.',                          'https://picsum.photos/seed/collection-women/1200/1500', 2),
  ('Unisex',         'unisex',       'Shared signatures, made to be worn by anyone.',             'https://picsum.photos/seed/collection-unisex/1200/1500', 3),
  ('Best Sellers',   'best-sellers', 'The house favourites, chosen by our clients.',               'https://picsum.photos/seed/collection-best-sellers/1200/1500', 4)
) as v(name, slug, description, image_url, sort_order)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_visible = true;

-- --- Products (16) ---------------------------------------------------------
insert into public.products (
  name, slug, brand, description, gender, concentration,
  top_notes, heart_notes, base_notes, scent_family, cover_image_url,
  is_featured, is_new, is_visible, sort_order
)
select
  v.name, v.slug, v.brand, v.description,
  v.gender::public.product_gender,
  v.concentration::public.product_concentration,
  v.top_notes::text[], v.heart_notes::text[], v.base_notes::text[],
  v.scent_family,
  'https://picsum.photos/seed/' || v.slug || '-cover/900/1200',
  v.is_featured, v.is_new, true, v.sort_order
from (values
  ('Oud Noir', 'oud-noir', 'Maison Noir',
   'A deep, resinous oud sharpened with saffron and rose, finished on warm sandalwood.',
   'men', 'Parfum',
   array['Saffron', 'Bergamot', 'Pink Pepper'], array['Rose', 'Leather', 'Dates'], array['Oud', 'Amber', 'Sandalwood'],
   'Woody', true, true, 1),

  ('Velours Rouge', 'velours-rouge', 'Maison Noir',
   'A red velvet floral, opening on ripe berries and settling into warm vanilla.',
   'women', 'EDP',
   array['Strawberry', 'Lychee'], array['Peony', 'Jasmine', 'Rose'], array['Vanilla', 'Cashmeran', 'White Musk'],
   'Oriental Floral', true, true, 2),

  ('Blanc de Nuit', 'blanc-de-nuit', 'Maison Noir',
   'A luminous white floral for the hours after midnight — neroli over clean musk.',
   'unisex', 'EDT',
   array['Bergamot', 'Lemon', 'Mint'], array['Neroli', 'Lily of the Valley'], array['White Musk', 'Cedar'],
   'Fresh Floral', true, false, 3),

  ('Amber Empress', 'amber-empress', 'Maison Noir',
   'Immortelle and orange blossom wrapped in amber, vanilla and tonka.',
   'women', 'Parfum',
   array['Orange Blossom', 'Bergamot'], array['Immortelle', 'Jasmine'], array['Amber', 'Tonka Bean', 'Vanilla'],
   'Amber', true, true, 4),

  ('Desert Santal', 'desert-santal', 'Maison Noir',
   'Cardamom and pink pepper over creamy sandalwood, iris and a dry cashmere base.',
   'unisex', 'EDP',
   array['Cardamom', 'Pink Pepper'], array['Sandalwood', 'Iris'], array['Cashmere', 'Vetiver', 'Amber'],
   'Woody', false, false, 5),

  ('Cairo Nights', 'cairo-nights', 'Maison Noir',
   'Incense and cardamom over rose and jasmine, closed with labdanum and benzoin.',
   'women', 'EDP',
   array['Incense', 'Cardamom', 'Pink Pepper'], array['Rose', 'Jasmine', 'Orange Blossom'], array['Labdanum', 'Benzoin', 'Vanilla'],
   'Smoky Floral', true, true, 6),

  ('Tobacco Noir', 'tobacco-noir', 'Maison Noir',
   'Tobacco leaf and cumin, warmed by cinnamon, leather and tonka.',
   'men', 'Parfum',
   array['Tobacco Leaf', 'Cumin', 'Cardamom'], array['Cinnamon', 'Leather'], array['Vanilla', 'Tonka Bean', 'Sandalwood'],
   'Amber Woody', true, false, 7),

  ('Fig & Cedar', 'fig-and-cedar', 'Maison Noir',
   'Green fig leaf and violet over cedar and vetiver. A study in dry woods.',
   'men', 'EDT',
   array['Fig Leaf', 'Bergamot'], array['Cedar', 'Violet Leaf'], array['Vetiver', 'White Musk'],
   'Green Woody', false, false, 8),

  ('Rose Ivoire', 'rose-ivoire', 'Maison Noir',
   'Rose de Mai softened with pear and peach, resting on white musk and sandalwood.',
   'women', 'EDP',
   array['Pear', 'Peach'], array['Rose de Mai', 'Peony'], array['White Musk', 'Sandalwood'],
   'Floral', false, false, 9),

  ('Myrrh Royale', 'myrrh-royale', 'Maison Noir',
   'Frankincense and myrrh in aldehyde light, closed with labdanum and patchouli.',
   'unisex', 'Parfum',
   array['Aldehydes', 'Bergamot'], array['Myrrh', 'Frankincense'], array['Labdanum', 'Benzoin', 'Patchouli'],
   'Resin', true, true, 10),

  ('Bergamot Silk', 'bergamot-silk', 'Maison Noir',
   'Bergamot and neroli over jasmine and green tea, finished in cashmeran.',
   'unisex', 'EDT',
   array['Bergamot', 'Neroli'], array['Jasmine', 'Green Tea'], array['White Musk', 'Cashmeran'],
   'Citrus Floral', false, false, 11),

  ('Leather & Oud', 'leather-and-oud', 'Maison Noir',
   'Saffron and plum over leather and saffron flower, with oud and ambergris.',
   'men', 'Parfum',
   array['Saffron', 'Plum'], array['Leather', 'Saffron Flower'], array['Oud', 'Ambergris', 'Benzoin'],
   'Leather', false, false, 12),

  ('Jasmine Noir', 'jasmine-noir', 'Maison Noir',
   'Jasmine sambac and tuberose, grounded by cashmere and sandalwood.',
   'women', 'EDP',
   array['Green Mandarin', 'Pear'], array['Jasmine Sambac', 'Tuberose'], array['Cashmere', 'Sandalwood', 'White Musk'],
   'Floral', false, true, 13),

  ('Vetiver Smoke', 'vetiver-smoke', 'Maison Noir',
   'Grapefruit and vetiver with cypress, tobacco and oakmoss.',
   'men', 'EDT',
   array['Grapefruit', 'Pink Pepper'], array['Vetiver', 'Cypress'], array['Tobacco', 'Oakmoss'],
   'Smoky', false, false, 14),

  ('Peche Sauvage', 'peche-sauvage', 'Maison Noir',
   'Wild peach and mandarins over magnolia and jasmine.',
   'women', 'EDT',
   array['Peach', 'Mandarins'], array['Magnolia', 'Jasmine'], array['Sandalwood', 'White Musk'],
   'Fruity Floral', false, false, 15),

  ('Musk Imperial', 'musk-imperial', 'Maison Noir',
   'Heliotrope and jasmine over white musk, amber and sandalwood. The house signature.',
   'unisex', 'Parfum',
   array['Bergamot', 'Aldehydes'], array['Heliotrope', 'Jasmine'], array['White Musk', 'Amber', 'Sandalwood'],
   'Amber Musk', true, true, 16)
) as v(name, slug, brand, description, gender, concentration, top_notes, heart_notes, base_notes, scent_family, is_featured, is_new, sort_order)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  gender = excluded.gender,
  concentration = excluded.concentration,
  top_notes = excluded.top_notes,
  heart_notes = excluded.heart_notes,
  base_notes = excluded.base_notes,
  scent_family = excluded.scent_family,
  cover_image_url = excluded.cover_image_url,
  is_featured = excluded.is_featured,
  is_new = excluded.is_new,
  is_visible = true,
  sort_order = excluded.sort_order;

-- --- Variants (2-3 per product) -------------------------------------------
insert into public.product_variants (product_id, size_ml, price, compare_at_price, stock, sku)
select s.product_id, s.size_ml, s.price, s.compare_at_price, s.stock, s.sku
from (
  select p.id as product_id, v.size_ml, v.price::numeric as price,
         v.compare_at_price::numeric as compare_at_price, v.stock, v.sku
  from (values
  ('oud-noir',         'MN-OUD', 30,  1450.00, null::numeric,      18, 'MN-OUD-30'),
  ('oud-noir',         'MN-OUD', 50,  2150.00, 2450.00::numeric,  12, 'MN-OUD-50'),
  ('oud-noir',         'MN-OUD', 100, 3400.00, null::numeric,       6, 'MN-OUD-100'),
  ('velours-rouge',    'MN-VLR', 30,  1250.00, null::numeric,      22, 'MN-VLR-30'),
  ('velours-rouge',    'MN-VLR', 50,  1850.00, 2150.00::numeric,  16, 'MN-VLR-50'),
  ('velours-rouge',    'MN-VLR', 100, 2950.00, null::numeric,       8, 'MN-VLR-100'),
  ('blanc-de-nuit',    'MN-BDN', 30,  1150.00, null::numeric,      30, 'MN-BDN-30'),
  ('blanc-de-nuit',    'MN-BDN', 50,  1650.00, null::numeric,      20, 'MN-BDN-50'),
  ('blanc-de-nuit',    'MN-BDN', 100, 2600.00, 2900.00::numeric,  10, 'MN-BDN-100'),
  ('amber-empress',    'MN-AME', 50,  2150.00, null::numeric,      14, 'MN-AME-50'),
  ('amber-empress',    'MN-AME', 100, 3400.00, null::numeric,       7, 'MN-AME-100'),
  ('desert-santal',    'MN-DSA', 30,  1250.00, null::numeric,      20, 'MN-DSA-30'),
  ('desert-santal',    'MN-DSA', 50,  1850.00, null::numeric,      15, 'MN-DSA-50'),
  ('desert-santal',    'MN-DSA', 100, 2950.00, 3200.00::numeric,   9, 'MN-DSA-100'),
  ('cairo-nights',     'MN-CAI', 30,  1250.00, null::numeric,      24, 'MN-CAI-30'),
  ('cairo-nights',     'MN-CAI', 50,  1850.00, null::numeric,      17, 'MN-CAI-50'),
  ('cairo-nights',     'MN-CAI', 100, 2950.00, null::numeric,       8, 'MN-CAI-100'),
  ('tobacco-noir',     'MN-TOB', 50,  2150.00, null::numeric,      13, 'MN-TOB-50'),
  ('tobacco-noir',     'MN-TOB', 100, 3400.00, 3800.00::numeric,   5, 'MN-TOB-100'),
  ('fig-and-cedar',    'MN-FGC', 30,  1150.00, null::numeric,      26, 'MN-FGC-30'),
  ('fig-and-cedar',    'MN-FGC', 50,  1650.00, null::numeric,      19, 'MN-FGC-50'),
  ('fig-and-cedar',    'MN-FGC', 100, 2600.00, null::numeric,      11, 'MN-FGC-100'),
  ('rose-ivoire',      'MN-ROS', 30,  1250.00, null::numeric,      21, 'MN-ROS-30'),
  ('rose-ivoire',      'MN-ROS', 50,  1850.00, 2050.00::numeric,  15, 'MN-ROS-50'),
  ('rose-ivoire',      'MN-ROS', 100, 2950.00, null::numeric,       8, 'MN-ROS-100'),
  ('myrrh-royale',     'MN-MYR', 50,  2150.00, null::numeric,      11, 'MN-MYR-50'),
  ('myrrh-royale',     'MN-MYR', 100, 3400.00, null::numeric,       6, 'MN-MYR-100'),
  ('bergamot-silk',    'MN-BSL', 30,  1150.00, null::numeric,      28, 'MN-BSL-30'),
  ('bergamot-silk',    'MN-BSL', 50,  1650.00, null::numeric,      20, 'MN-BSL-50'),
  ('bergamot-silk',    'MN-BSL', 100, 2600.00, null::numeric,      10, 'MN-BSL-100'),
  ('leather-and-oud',  'MN-LEO', 50,  2150.00, null::numeric,       9, 'MN-LEO-50'),
  ('leather-and-oud',  'MN-LEO', 100, 3400.00, null::numeric,       4, 'MN-LEO-100'),
  ('jasmine-noir',     'MN-JSN', 30,  1250.00, null::numeric,      19, 'MN-JSN-30'),
  ('jasmine-noir',     'MN-JSN', 50,  1850.00, null::numeric,      14, 'MN-JSN-50'),
  ('jasmine-noir',     'MN-JSN', 100, 2950.00, null::numeric,       7, 'MN-JSN-100'),
  ('vetiver-smoke',    'MN-VSM', 30,  1150.00, null::numeric,      23, 'MN-VSM-30'),
  ('vetiver-smoke',    'MN-VSM', 50,  1650.00, 1850.00::numeric,  16, 'MN-VSM-50'),
  ('vetiver-smoke',    'MN-VSM', 100, 2600.00, null::numeric,       9, 'MN-VSM-100'),
  ('peche-sauvage',    'MN-PCH', 30,  1150.00, null::numeric,      25, 'MN-PCH-30'),
  ('peche-sauvage',    'MN-PCH', 50,  1650.00, null::numeric,      18, 'MN-PCH-50'),
  ('peche-sauvage',    'MN-PCH', 100, 2600.00, null::numeric,      10, 'MN-PCH-100'),
  ('musk-imperial',    'MN-MUS', 50,  2150.00, null::numeric,      17, 'MN-MUS-50'),
  ('musk-imperial',    'MN-MUS', 100, 3400.00, 3900.00::numeric,   9, 'MN-MUS-100')
) as v(slug, code, size_ml, price, compare_at_price, stock, sku)
  join public.products p on p.slug = v.slug
) as s
on conflict (sku) do update set
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  stock = excluded.stock;

-- --- Product images (cover + 3 gallery per product) -----------------------
insert into public.product_images (product_id, image_url, sort_order)
select p.id, 'https://picsum.photos/seed/' || v.seed || '/900/1200', v.sort_order
from (values
  ('oud-noir',        'oud-noir-cover',        0),
  ('oud-noir',        'oud-noir-gallery-1',    1),
  ('oud-noir',        'oud-noir-gallery-2',    2),
  ('oud-noir',        'oud-noir-gallery-3',    3),
  ('velours-rouge',   'velours-rouge-cover',   0),
  ('velours-rouge',   'velours-rouge-gallery-1', 1),
  ('velours-rouge',   'velours-rouge-gallery-2', 2),
  ('velours-rouge',   'velours-rouge-gallery-3', 3),
  ('blanc-de-nuit',   'blanc-de-nuit-cover',   0),
  ('blanc-de-nuit',   'blanc-de-nuit-gallery-1', 1),
  ('blanc-de-nuit',   'blanc-de-nuit-gallery-2', 2),
  ('blanc-de-nuit',   'blanc-de-nuit-gallery-3', 3),
  ('amber-empress',   'amber-empress-cover',   0),
  ('amber-empress',   'amber-empress-gallery-1', 1),
  ('amber-empress',   'amber-empress-gallery-2', 2),
  ('amber-empress',   'amber-empress-gallery-3', 3),
  ('desert-santal',   'desert-santal-cover',   0),
  ('desert-santal',   'desert-santal-gallery-1', 1),
  ('desert-santal',   'desert-santal-gallery-2', 2),
  ('desert-santal',   'desert-santal-gallery-3', 3),
  ('cairo-nights',    'cairo-nights-cover',    0),
  ('cairo-nights',    'cairo-nights-gallery-1', 1),
  ('cairo-nights',    'cairo-nights-gallery-2', 2),
  ('cairo-nights',    'cairo-nights-gallery-3', 3),
  ('tobacco-noir',    'tobacco-noir-cover',    0),
  ('tobacco-noir',    'tobacco-noir-gallery-1', 1),
  ('tobacco-noir',    'tobacco-noir-gallery-2', 2),
  ('tobacco-noir',    'tobacco-noir-gallery-3', 3),
  ('fig-and-cedar',   'fig-and-cedar-cover',   0),
  ('fig-and-cedar',   'fig-and-cedar-gallery-1', 1),
  ('fig-and-cedar',   'fig-and-cedar-gallery-2', 2),
  ('fig-and-cedar',   'fig-and-cedar-gallery-3', 3),
  ('rose-ivoire',     'rose-ivoire-cover',     0),
  ('rose-ivoire',     'rose-ivoire-gallery-1', 1),
  ('rose-ivoire',     'rose-ivoire-gallery-2', 2),
  ('rose-ivoire',     'rose-ivoire-gallery-3', 3),
  ('myrrh-royale',    'myrrh-royale-cover',    0),
  ('myrrh-royale',    'myrrh-royale-gallery-1', 1),
  ('myrrh-royale',    'myrrh-royale-gallery-2', 2),
  ('myrrh-royale',    'myrrh-royale-gallery-3', 3),
  ('bergamot-silk',   'bergamot-silk-cover',   0),
  ('bergamot-silk',   'bergamot-silk-gallery-1', 1),
  ('bergamot-silk',   'bergamot-silk-gallery-2', 2),
  ('bergamot-silk',   'bergamot-silk-gallery-3', 3),
  ('leather-and-oud', 'leather-and-oud-cover', 0),
  ('leather-and-oud', 'leather-and-oud-gallery-1', 1),
  ('leather-and-oud', 'leather-and-oud-gallery-2', 2),
  ('leather-and-oud', 'leather-and-oud-gallery-3', 3),
  ('jasmine-noir',    'jasmine-noir-cover',    0),
  ('jasmine-noir',    'jasmine-noir-gallery-1', 1),
  ('jasmine-noir',    'jasmine-noir-gallery-2', 2),
  ('jasmine-noir',    'jasmine-noir-gallery-3', 3),
  ('vetiver-smoke',   'vetiver-smoke-cover',   0),
  ('vetiver-smoke',   'vetiver-smoke-gallery-1', 1),
  ('vetiver-smoke',   'vetiver-smoke-gallery-2', 2),
  ('vetiver-smoke',   'vetiver-smoke-gallery-3', 3),
  ('peche-sauvage',   'peche-sauvage-cover',   0),
  ('peche-sauvage',   'peche-sauvage-gallery-1', 1),
  ('peche-sauvage',   'peche-sauvage-gallery-2', 2),
  ('peche-sauvage',   'peche-sauvage-gallery-3', 3),
  ('musk-imperial',   'musk-imperial-cover',   0),
  ('musk-imperial',   'musk-imperial-gallery-1', 1),
  ('musk-imperial',   'musk-imperial-gallery-2', 2),
  ('musk-imperial',   'musk-imperial-gallery-3', 3)
) as v(slug, seed, sort_order)
join public.products p on p.slug = v.slug
on conflict (product_id, image_url) do nothing;

-- --- Product <-> collection links ----------------------------------------
insert into public.product_collections (product_id, collection_id)
select s.product_id, s.collection_id
from (
  select p.id as product_id, c.id as collection_id
  from public.products p
  join public.collections c on c.slug = 'men'
  where p.slug = any (array['oud-noir', 'tobacco-noir', 'fig-and-cedar', 'leather-and-oud', 'vetiver-smoke'])
) as s
on conflict do nothing;

insert into public.product_collections (product_id, collection_id)
select s.product_id, s.collection_id
from (
  select p.id as product_id, c.id as collection_id
  from public.products p
  join public.collections c on c.slug = 'women'
  where p.slug = any (array['velours-rouge', 'amber-empress', 'cairo-nights', 'rose-ivoire', 'jasmine-noir', 'peche-sauvage'])
) as s
on conflict do nothing;

insert into public.product_collections (product_id, collection_id)
select s.product_id, s.collection_id
from (
  select p.id as product_id, c.id as collection_id
  from public.products p
  join public.collections c on c.slug = 'unisex'
  where p.slug = any (array['blanc-de-nuit', 'desert-santal', 'myrrh-royale', 'bergamot-silk', 'musk-imperial'])
) as s
on conflict do nothing;

insert into public.product_collections (product_id, collection_id)
select s.product_id, s.collection_id
from (
  select p.id as product_id, c.id as collection_id
  from public.products p
  join public.collections c on c.slug = 'best-sellers'
  where p.slug = any (array['oud-noir', 'velours-rouge', 'blanc-de-nuit', 'amber-empress', 'cairo-nights', 'tobacco-noir', 'myrrh-royale', 'leather-and-oud'])
) as s
on conflict do nothing;

-- --- Shipping zones: all 27 Egyptian governorates --------------------------
insert into public.shipping_zones (governorate, fee, is_active)
select v.governorate, v.fee::numeric, true
from (values
  ('Cairo',           45.00),
  ('Giza',            50.00),
  ('Alexandria',      60.00),
  ('Qalyubia',        45.00),
  ('Port Said',       60.00),
  ('Suez',            60.00),
  ('Dakahlia',        50.00),
  ('Sharqia',         50.00),
  ('Gharbia',         50.00),
  ('Monufia',         50.00),
  ('Beheira',         60.00),
  ('Kafr El Sheikh',  60.00),
  ('Damietta',        60.00),
  ('Ismailia',        60.00),
  ('Faiyum',          55.00),
  ('Beni Suef',       55.00),
  ('Minya',           55.00),
  ('Asyut',           60.00),
  ('Sohag',           65.00),
  ('Qena',            65.00),
  ('Luxor',           70.00),
  ('Aswan',           75.00),
  ('Red Sea',         85.00),
  ('New Valley',      90.00),
  ('Matrouh',         85.00),
  ('North Sinai',      95.00),
  ('South Sinai',      95.00)
) as v(governorate, fee)
on conflict (governorate) do update set fee = excluded.fee, is_active = true;

-- --- Coupons ---------------------------------------------------------------
insert into public.coupons (code, type, value, min_order, max_uses, used_count, expires_at, is_active)
values
  ('WELCOME10', 'percent', 10.00, 1000.00, 500, 0, now() + interval '6 months', true),
  ('NOIR50',    'fixed',   50.00,  750.00, null, 0, now() + interval '3 months', true)
on conflict (code) do update set
  type = excluded.type,
  value = excluded.value,
  min_order = excluded.min_order,
  max_uses = excluded.max_uses,
  expires_at = excluded.expires_at,
  is_active = true;

-- =============================================================================
-- Done. Next steps:
--   1. Insert your admin user id into public.admins:
--        insert into public.admins (user_id) values ('<auth user id>');
--   2. Call the order RPC from the server only:
--        supabase.rpc('create_order', { p_items, p_customer_name, ... })
-- =============================================================================
