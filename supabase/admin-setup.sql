-- Jalankan sekali di Supabase Dashboard > SQL Editor.
-- 1) Buat tabel allowlist admin. User yang tidak tercantum di tabel ini
--    tetap tidak akan mendapat akses admin meskipun berhasil login.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

grant select on table public.admin_users to authenticated;

drop policy if exists "Admins can read their own admin record" on public.admin_users;
create policy "Admins can read their own admin record"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

-- 2) Buat akun admin terlebih dahulu melalui Authentication > Users > Add user.
-- 3) Ganti alamat email di bawah dengan email akun admin tersebut, lalu jalankan
--    query ini. Hanya akun yang dimasukkan ke tabel admin_users yang diizinkan.
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where lower(email) = lower('GANTI_DENGAN_EMAIL_ADMIN')
on conflict (user_id) do update set email = excluded.email;

-- Catatan: jangan membuat policy INSERT/UPDATE/DELETE untuk role anon/authenticated.
-- Penambahan atau pencabutan admin dilakukan oleh pemilik project melalui SQL Editor.
