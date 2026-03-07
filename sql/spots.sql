-- Spots Table Definition
-- capturing all fields from AddSpotPage and admin requirements

create table if not exists public.spots (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  city text,
  category text, -- Restaurant, Cafe, Bar, Park, Entertainment, Shopping, Other
  
  -- Contact Info
  phone text,
  whatsapp text,
  instagram text,
  
  -- Timing
  opening_time text,
  closing_time text,
  
  -- Features & Menu
  features text[] default '{}',
  special_dishes text[] default '{}',
  average_cost int,
  
  -- Media
  images text[] default '{}',
  
  -- Location (Lat/Lng)
  latitude float8,
  longitude float8,
  
  -- Stats (Managed by triggers)
  rating float8 default 0,
  review_count int default 0,
  view_count int default 0,
  visit_count int default 0,
  
  -- Admin & Ownership
  created_by uuid references public.users(id),
  is_verified boolean default false,
  is_featured boolean default false,
  status text default 'pending', -- pending, approved, rejected
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.spots enable row level security;

-- RLS Policies
drop policy if exists "Spots are viewable by everyone" on public.spots;
create policy "Spots are viewable by everyone" 
  on public.spots for select using (status = 'approved' or auth.uid() = created_by or (select is_admin from public.users where id = auth.uid()));

drop policy if exists "Authenticated users can create spots" on public.spots;
create policy "Authenticated users can create spots" 
  on public.spots for insert with check (auth.role() = 'authenticated');

drop policy if exists "Users can update their own spots" on public.spots;
create policy "Users can update their own spots" 
  on public.spots for update using (auth.uid() = created_by or (select is_admin from public.users where id = auth.uid()));

-- Trigger for updated_at
create or replace function public.handle_spots_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_spots_updated on public.spots;
create trigger on_spots_updated
  before update on public.spots
  for each row execute procedure public.handle_spots_updated_at();
