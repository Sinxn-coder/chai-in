-- Spot Suggestions Table Definition
create table if not exists public.spot_suggestions (
  id uuid default gen_random_uuid() primary key,
  spot_id uuid not null references public.spots(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  suggestion text not null,
  status text default 'pending', -- pending, reviewed, implemented, rejected
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.spot_suggestions enable row level security;

-- RLS Policies
drop policy if exists "Users can view their own suggestions" on public.spot_suggestions;
create policy "Users can view their own suggestions"
  on public.spot_suggestions for select
  using (auth.uid() = user_id or (select is_admin from public.users where id = auth.uid()));

drop policy if exists "Authenticated users can create suggestions" on public.spot_suggestions;
create policy "Authenticated users can create suggestions"
  on public.spot_suggestions for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update suggestions" on public.spot_suggestions;
create policy "Admins can update suggestions"
  on public.spot_suggestions for update
  using ((select is_admin from public.users where id = auth.uid()));
