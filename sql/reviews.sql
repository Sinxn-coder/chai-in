-- Reviews Table Definition
-- Supports ratings, comments, and images

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  spot_id uuid references public.spots(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  
  content text,
  rating int check (rating >= 1 and rating <= 5) not null,
  images text[] default '{}',
  
  created_at timestamptz default now(),
  
  -- Ensure one review per user per spot
  unique(user_id, spot_id)
);

-- Enable RLS
alter table public.reviews enable row level security;

-- RLS Policies
drop policy if exists "Reviews are viewable by everyone" on public.reviews;
create policy "Reviews are viewable by everyone" 
  on public.reviews for select using (true);

-- Authenticated users can create reviews
drop policy if exists "Authenticated users can create reviews" on public.reviews;
create policy "Authenticated users can create reviews" 
  on public.reviews for insert with check (auth.role() = 'authenticated');

-- Reviewers or Admins can delete
drop policy if exists "Users can delete their own reviews" on public.reviews;
create policy "Users can delete their own reviews" 
  on public.reviews for delete using (auth.uid() = user_id or (select is_admin from public.users where id = auth.uid()));

-- Reviewers can update their own reviews
drop policy if exists "Users can update their own reviews" on public.reviews;
create policy "Users can update their own reviews" 
  on public.reviews for update using (auth.uid() = user_id);

-- Trigger to update spot rating and review count
create or replace function public.update_spot_stats()
returns trigger as $$
begin
  if (TG_OP = 'INSERT' or TG_OP = 'UPDATE') then
    update public.spots
    set 
      rating = (select coalesce(avg(rating), 0) from public.reviews where spot_id = new.spot_id),
      review_count = (select count(*) from public.reviews where spot_id = new.spot_id)
    where id = new.spot_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.spots
    set 
      rating = (select coalesce(avg(rating), 0) from public.reviews where spot_id = old.spot_id),
      review_count = (select count(*) from public.reviews where spot_id = old.spot_id)
    where id = old.spot_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_spot_stats();
