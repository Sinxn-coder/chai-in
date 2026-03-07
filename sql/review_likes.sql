-- Review Likes Table and Engagement Trigger

create table if not exists public.review_likes (
  user_id uuid references public.users(id) on delete cascade not null,
  review_id uuid references public.reviews(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, review_id)
);

-- Add likes_count column to reviews table if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='reviews' and column_name='likes_count') then
    alter table public.reviews add column likes_count int default 0;
  end if;
end $$;

-- Enable RLS
alter table public.review_likes enable row level security;

-- RLS Policies
drop policy if exists "Review likes are viewable by everyone" on public.review_likes;
create policy "Review likes are viewable by everyone" 
  on public.review_likes for select using (true);

drop policy if exists "Users can manage their own review likes" on public.review_likes;
create policy "Users can manage their own review likes" 
  on public.review_likes for all using (auth.uid() = user_id);

-- Trigger to update review likes count
create or replace function public.handle_review_like_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.reviews set likes_count = likes_count + 1 where id = new.review_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.reviews set likes_count = likes_count - 1 where id = old.review_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_like_change on public.review_likes;
create trigger on_review_like_change
  after insert or delete on public.review_likes
  for each row execute procedure public.handle_review_like_change();
