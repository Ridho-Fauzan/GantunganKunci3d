-- Friendship KeyChain: make Instagram optional for existing orders table.
-- Run once in Supabase Dashboard > SQL Editor after deploying the matching frontend.

alter table public.orders alter column instagram drop not null;

alter table public.orders
  drop constraint if exists orders_instagram_check;

alter table public.orders
  add constraint orders_instagram_check
  check (instagram is null or char_length(trim(instagram)) between 1 and 50);

drop policy if exists "Anyone can submit a preorder" on public.orders;

create policy "Anyone can submit a preorder"
on public.orders for insert
to anon, authenticated
with check (
  status = 'new'
  and char_length(trim(customer_name)) between 1 and 100
  and (instagram is null or char_length(trim(instagram)) between 1 and 50)
  and quantity between 1 and 1000
);
