create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.store_products (
  id text primary key,
  name text not null,
  kind text not null check (kind in ('design', 'accessory')),
  price bigint not null check (price >= 0),
  sale_price bigint check (sale_price is null or (sale_price >= 0 and sale_price < price)),
  image text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null references public.store_products (id) on delete cascade,
  quantity integer not null check (quantity between 1 and 99),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.saved_inspiration (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  status text not null default 'placed'
    check (status in ('placed', 'received', 'payment_confirmed', 'shipped', 'delivered', 'cancelled')),
  customer_name text not null,
  customer_email text not null,
  phone text not null,
  shipping_address text not null,
  subtotal bigint not null default 0 check (subtotal >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text,
  product_name text not null,
  product_kind text not null check (product_kind in ('design', 'accessory')),
  image text,
  quantity integer not null check (quantity between 1 and 99),
  unit_price bigint not null check (unit_price >= 0),
  line_total bigint not null check (line_total >= 0)
);

create table if not exists public.order_status_history (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null
    check (status in ('placed', 'received', 'payment_confirmed', 'shipped', 'delivered', 'cancelled')),
  changed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists order_status_history_order_idx on public.order_status_history (order_id, created_at);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.create_profile_for_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      phone = excluded.phone,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
after insert on auth.users
for each row execute function public.create_profile_for_user();

insert into public.profiles (id, full_name, phone)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', ''),
  coalesce(raw_user_meta_data ->> 'phone', '')
from auth.users
on conflict (id) do nothing;

create or replace function public.record_order_status()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.order_status_history (order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists record_order_status_change on public.orders;
create trigger record_order_status_change
before insert or update of status on public.orders
for each row execute function public.record_order_status();

create or replace function public.enforce_order_status_transition()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if old.status = 'placed' and new.status in ('received', 'cancelled') then
    return new;
  elsif old.status = 'received' and new.status in ('payment_confirmed', 'cancelled') then
    return new;
  elsif old.status = 'payment_confirmed' and new.status in ('shipped', 'cancelled') then
    return new;
  elsif old.status = 'shipped' and new.status in ('delivered', 'cancelled') then
    return new;
  end if;

  raise exception 'Invalid order status transition: % to %', old.status, new.status;
end;
$$;

drop trigger if exists enforce_order_status_transition on public.orders;
create trigger enforce_order_status_transition
before update of status on public.orders
for each row execute function public.enforce_order_status_transition();

create or replace function public.sync_store_products(p_products jsonb)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item jsonb;
  v_price bigint;
  v_sale_price bigint;
begin
  if not public.is_admin() then
    raise exception 'Administrator access is required.';
  end if;
  if p_products is null or jsonb_typeof(p_products) <> 'array' then
    raise exception 'Products must be supplied as an array.';
  end if;

  update public.store_products set is_active = false, updated_at = now();

  for v_item in select value from jsonb_array_elements(p_products)
  loop
    if nullif(v_item ->> 'price', '') is null then
      continue;
    end if;
    v_price := (v_item ->> 'price')::bigint;
    if v_price < 0 then
      raise exception 'Product price cannot be negative.';
    end if;
    v_sale_price := nullif(v_item ->> 'salePrice', '')::bigint;
    if v_sale_price is not null and (v_sale_price < 0 or v_sale_price >= v_price) then
      v_sale_price := null;
    end if;

    insert into public.store_products (id, name, kind, price, sale_price, image, is_active, updated_at)
    values (
      v_item ->> 'id',
      v_item ->> 'name',
      v_item ->> 'kind',
      v_price,
      v_sale_price,
      nullif(v_item ->> 'image', ''),
      true,
      now()
    )
    on conflict (id) do update
    set name = excluded.name,
        kind = excluded.kind,
        price = excluded.price,
        sale_price = excluded.sale_price,
        image = excluded.image,
        is_active = true,
        updated_at = now();
  end loop;
end;
$$;

create or replace function public.create_order(
  p_items jsonb,
  p_customer_name text,
  p_phone text,
  p_shipping_address text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product public.store_products%rowtype;
  v_quantity integer;
  v_unit_price bigint;
  v_subtotal bigint := 0;
begin
  if auth.uid() is null then
    raise exception 'Sign in before placing an order.';
  end if;
  if nullif(trim(p_customer_name), '') is null
    or nullif(trim(p_phone), '') is null
    or nullif(trim(p_shipping_address), '') is null then
    raise exception 'Name, phone, and delivery address are required.';
  end if;
  if p_items is null
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) < 1
    or jsonb_array_length(p_items) > 50 then
    raise exception 'Your cart must contain between 1 and 50 products.';
  end if;

  insert into public.orders (user_id, customer_name, customer_email, phone, shipping_address, subtotal)
  values (
    auth.uid(),
    trim(p_customer_name),
    coalesce(auth.jwt() ->> 'email', ''),
    trim(p_phone),
    trim(p_shipping_address),
    0
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity < 1 or v_quantity > 99 then
      raise exception 'Product quantity must be between 1 and 99.';
    end if;

    select * into v_product
    from public.store_products
    where id = v_item ->> 'product_id'
      and is_active = true;
    if not found then
      raise exception 'A product in your cart is no longer available.';
    end if;

    v_unit_price := coalesce(v_product.sale_price, v_product.price);
    v_subtotal := v_subtotal + (v_unit_price * v_quantity);
    insert into public.order_items (
      order_id, product_id, product_name, product_kind, image, quantity, unit_price, line_total
    )
    values (
      v_order_id, v_product.id, v_product.name, v_product.kind, v_product.image,
      v_quantity, v_unit_price, v_unit_price * v_quantity
    );
  end loop;

  update public.orders set subtotal = v_subtotal where id = v_order_id;
  delete from public.cart_items where user_id = auth.uid();
  return v_order_id;
end;
$$;

create or replace function public.admin_set_order_status(
  p_order_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access is required.';
  end if;
  if p_status not in ('received', 'payment_confirmed', 'shipped', 'delivered', 'cancelled') then
    raise exception 'Invalid order status.';
  end if;

  update public.orders set status = p_status where id = p_order_id;
  if not found then
    raise exception 'Order not found.';
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.store_products enable row level security;
alter table public.cart_items enable row level security;
alter table public.saved_inspiration enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

drop policy if exists "Customers can view their profile" on public.profiles;
create policy "Customers can view their profile" on public.profiles
for select to authenticated using (id = auth.uid());
drop policy if exists "Customers can update their profile" on public.profiles;
create policy "Customers can update their profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Anyone can view active products" on public.store_products;
create policy "Anyone can view active products" on public.store_products
for select to anon, authenticated using (is_active or public.is_admin());

drop policy if exists "Customers can manage their cart" on public.cart_items;
create policy "Customers can manage their cart" on public.cart_items
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Customers can manage saved inspiration" on public.saved_inspiration;
create policy "Customers can manage saved inspiration" on public.saved_inspiration
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Customers and admins can view orders" on public.orders;
create policy "Customers and admins can view orders" on public.orders
for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Customers and admins can view order items" on public.order_items;
create policy "Customers and admins can view order items" on public.order_items
for select to authenticated using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "Customers and admins can view order status history" on public.order_status_history;
create policy "Customers and admins can view order status history" on public.order_status_history
for select to authenticated using (
  exists (
    select 1 from public.orders
    where orders.id = order_status_history.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

revoke all on public.admin_users from anon, authenticated;
revoke all on function public.create_profile_for_user() from public, anon, authenticated;
revoke all on function public.record_order_status() from public, anon, authenticated;
revoke all on function public.enforce_order_status_transition() from public, anon, authenticated;
revoke all on function public.sync_store_products(jsonb) from public, anon;
revoke all on function public.create_order(jsonb, text, text, text) from public, anon;
revoke all on function public.admin_set_order_status(uuid, text) from public, anon;
grant select, update on public.profiles to authenticated;
grant select on public.store_products to anon, authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select, insert, delete on public.saved_inspiration to authenticated;
grant select on public.orders, public.order_items, public.order_status_history to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.sync_store_products(jsonb) to authenticated;
grant execute on function public.create_order(jsonb, text, text, text) to authenticated;
grant execute on function public.admin_set_order_status(uuid, text) to authenticated;
