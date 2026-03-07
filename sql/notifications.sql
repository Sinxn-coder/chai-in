-- Notifications Table Definition

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  
  type text not null, -- 'like', 'comment', 'spot_approved', 'system'
  title text,
  message text,
  data jsonb default '{}',
  
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- RLS Policies
drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications" 
  on public.notifications for select using (auth.uid() = user_id);

drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications" 
  on public.notifications for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own notifications" on public.notifications;
create policy "Users can delete their own notifications" 
  on public.notifications for delete using (auth.uid() = user_id);
