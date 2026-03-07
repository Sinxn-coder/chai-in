-- Community Posts Table Definition

create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  content text,
  images text[] default '{}',
  
  -- Stats (Managed by triggers)
  likes_count int default 0,
  comments_count int default 0,
  view_count int default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.posts enable row level security;

-- RLS Policies
drop policy if exists "Posts are viewable by everyone" on public.posts;
create policy "Posts are viewable by everyone" 
  on public.posts for select using (true);

drop policy if exists "Authenticated users can create posts" on public.posts;
create policy "Authenticated users can create posts" 
  on public.posts for insert with check (auth.role() = 'authenticated');

drop policy if exists "Users can update their own posts" on public.posts;
create policy "Users can update their own posts" 
  on public.posts for update using (auth.uid() = user_id or (select is_admin from public.users where id = auth.uid()));

drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts" 
  on public.posts for delete using (auth.uid() = user_id or (select is_admin from public.users where id = auth.uid()));

-- Trigger for updated_at
create or replace function public.handle_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_posts_updated on public.posts;
create trigger on_posts_updated
  before update on public.posts
  for each row execute procedure public.handle_posts_updated_at();
