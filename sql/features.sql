-- Features Table Definition
-- To manage spot features dynamically with custom icons

create table if not exists public.features (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  icon_name text, -- e.g., 'wifi', 'parking', 'ac', 'music'
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.features enable row level security;

-- RLS Policies
drop policy if exists "Features are viewable by everyone" on public.features;
create policy "Features are viewable by everyone" 
  on public.features for select using (true);

drop policy if exists "Only admins can manage features" on public.features;
create policy "Only admins can manage features" 
  on public.features for all using (
    (select is_admin from public.users where id = auth.uid())
  );

-- Clear existing data
delete from public.features;

-- Seed initial features with custom icon identifiers
insert into public.features (name, icon_name)
values 
  ('Free WiFi', 'wifi'),
  ('Parking', 'parking'),
  ('AC', 'ac'),
  ('Comfortable Seating', 'chair'),
  ('Hygiene Focused', 'clean'),
  ('Card Payment', 'card'),
  ('Live Music', 'music'),
  ('Outdoor Seating', 'outdoor'),
  ('Pet Friendly', 'pet'),
  ('Takeout available', 'takeout'),
  ('Valet Parking', 'valet')
on conflict (name) do nothing;
