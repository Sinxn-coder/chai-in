-- 1. Create User Usage Table
create table if not exists public.user_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  usage_date date default current_date not null,
  minutes int default 0 not null,
  last_synced_at timestamptz default now(),
  unique(user_id, usage_date)
);

-- 2. Enable RLS
alter table public.user_usage enable row level security;

-- 3. RLS Policies
drop policy if exists "Users can manage their own usage" on public.user_usage;
create policy "Users can manage their own usage" 
  on public.user_usage for all 
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins can view all usage" on public.user_usage;
create policy "Admins can view all usage"
  on public.user_usage for select
  using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- 4. Indexes
create index if not exists idx_user_usage_date on public.user_usage(usage_date);
create index if not exists idx_user_usage_user_id on public.user_usage(user_id);

-- 5. Seed historical data for visualization
do $$
declare
    user_record record;
    i int;
    random_mins int;
    target_date date;
begin
    for user_record in select id from public.users limit 10 loop
        for i in 0..7 loop
            target_date := (current_date - i);
            random_mins := floor(random() * 45 + 15); -- 15-60 mins per day
            
            insert into public.user_usage (user_id, usage_date, minutes, last_synced_at)
            values (user_record.id, target_date, random_mins, now())
            on conflict (user_id, usage_date) do update
            set minutes = user_usage.minutes + excluded.minutes;
        end loop;
    end loop;
end $$;
