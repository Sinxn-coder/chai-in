-- Favorites Table Definition

create table if not exists public.favorites (
  user_id uuid references public.users(id) on delete cascade,
  spot_id uuid references public.spots(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, spot_id)
);

-- Enable RLS
alter table public.favorites enable row level security;

-- RLS Policies
drop policy if exists "Users can manage their own favorites" on public.favorites;
create policy "Users can manage their own favorites" 
  on public.favorites for all using (auth.uid() = user_id);
