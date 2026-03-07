-- Categories Table Definition
-- To manage spot categories dynamically for Admin

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  icon_name text, -- FontAwesome or Material icon name
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.categories enable row level security;

-- RLS Policies
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone" 
  on public.categories for select using (true);

drop policy if exists "Only admins can manage categories" on public.categories;
create policy "Only admins can manage categories" 
  on public.categories for all using (
    (select is_admin from public.users where id = auth.uid())
  );

-- Seed some initial categories
insert into public.categories (name, icon_name)
values 
  ('Cafe', 'coffee'),
  ('Restaurant', 'utensils'),
  ('Street Food', 'hamburger'),
  ('Bar', 'glass-martini'),
  ('Hotel', 'hotel'),
  ('Bakery', 'birthday-cake')
on conflict (name) do nothing;
