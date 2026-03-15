-- System Settings Table
-- To manage global app configurations like maintenance mode

create table if not exists public.system_settings (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- RLS Policies
drop policy if exists "System settings are viewable by everyone" on public.system_settings;
create policy "System settings are viewable by everyone" 
  on public.system_settings for select using (true);

drop policy if exists "Only admins can manage system settings" on public.system_settings;
create policy "Only admins can manage system settings" 
  on public.system_settings for all using (
    (select is_admin from public.users where id = auth.uid())
  );

-- Seed maintenance mode setting
insert into public.system_settings (key, value)
values ('maintenance_mode', 'false'::jsonb)
on conflict (key) do nothing;
