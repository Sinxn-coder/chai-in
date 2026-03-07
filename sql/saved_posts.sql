-- Saved Posts Table Definition
-- Tracks which community posts a user has saved

create table if not exists public.saved_posts (
  user_id uuid references public.users(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- Enable RLS
alter table public.saved_posts enable row level security;

-- RLS Policies
drop policy if exists "Users can manage their own saved posts" on public.saved_posts;
create policy "Users can manage their own saved posts" 
  on public.saved_posts for all using (auth.uid() = user_id);
