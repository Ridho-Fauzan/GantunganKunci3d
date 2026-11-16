-- Friendship KeyChain: database pesanan
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor.
-- Tabel ini menerima pre-order publik, tetapi hanya admin allowlist yang dapat membaca/mengubahnya.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(trim(customer_name)) between 1 and 100),
  instagram text check (instagram is null or char_length(trim(instagram)) between 1 and 50),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 25),
  product_name text not null check (char_length(trim(product_name)) between 1 and 160),
  quantity integer not null check (quantity between 1 and 1000),
  print_sides text not null default '2 sisi' check (print_sides in ('1 sisi', '2 sisi')),
  custom_text text check (custom_text is null or char_length(custom_text) <= 300),
  color text check (color is null or char_length(color) <= 120),
  notes text check (notes is null or char_length(notes) <= 2000),
  design jsonb,
  summary text not null check (char_length(summary) between 1 and 8000),
  status text not null default 'new' check (status in ('new', 'confirmed', 'processing', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

-- Hapus policy lama jika SQL dijalankan ulang.
drop policy if exists "Anyone can submit a preorder" on public.orders;
drop policy if exists "Admins can view orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;

-- Pengunjung hanya boleh INSERT pesanan baru. Mereka tidak bisa SELECT data pesanan.
create policy "Anyone can submit a preorder"
on public.orders for insert
to anon, authenticated
with check (
  status = 'new'
  and char_length(trim(customer_name)) between 1 and 100
  and (instagram is null or char_length(trim(instagram)) between 1 and 50)
  and quantity between 1 and 1000
);

-- Hanya user yang terdaftar di admin_users boleh melihat pesanan.
create policy "Admins can view orders"
on public.orders for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

-- Hanya admin yang boleh mengubah status/detail pesanan.
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;
revoke delete on public.orders from anon, authenticated;

-- Catatan:
-- 1) Jangan menambahkan policy SELECT untuk anon/public.
-- 2) Penghapusan pesanan tidak disediakan dari browser.
-- 3) Admin yang dapat mengakses tabel tetap harus memiliki baris di public.admin_users.
