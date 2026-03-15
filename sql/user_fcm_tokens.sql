-- User FCM Tokens Table
-- Used to store Firebase Cloud Messaging tokens for push notifications

create table if not exists public.user_fcm_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  token text not null,
  device_type text, -- 'android', 'ios', 'web'
  last_seen timestamptz default now(),
  created_at timestamptz default now(),
  
  -- Ensure the same token isn't added multiple times for the same user
  unique(user_id, token)
);

-- Enable RLS
alter table public.user_fcm_tokens enable row level security;

-- RLS Policies
drop policy if exists "Users can manage their own tokens" on public.user_fcm_tokens;
create policy "Users can manage their own tokens" 
  on public.user_fcm_tokens for all using (auth.uid() = user_id);

-- Index for faster lookups
create index if not exists idx_user_fcm_tokens_user_id on public.user_fcm_tokens(user_id);
