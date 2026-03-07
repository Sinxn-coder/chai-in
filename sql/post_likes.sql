-- Post Likes Table and Engagement Trigger

create table if not exists public.post_likes (
  user_id uuid references public.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- Enable RLS
alter table public.post_likes enable row level security;

-- RLS Policies
drop policy if exists "Likes are viewable by everyone" on public.post_likes;
create policy "Likes are viewable by everyone" 
  on public.post_likes for select using (true);

drop policy if exists "Users can manage their own likes" on public.post_likes;
create policy "Users can manage their own likes" 
  on public.post_likes for all using (auth.uid() = user_id);

-- Trigger to update post stats and create notification
create or replace function public.handle_post_like_engagement()
returns trigger as $$
declare
  post_owner_id uuid;
begin
  if (TG_OP = 'INSERT') then
    -- 1. Update like count
    update public.posts set likes_count = likes_count + 1 where id = new.post_id;
    
    -- 2. Create notification for post owner (if not liking own post)
    select user_id into post_owner_id from public.posts where id = new.post_id;
    if (post_owner_id != new.user_id) then
      insert into public.notifications (user_id, type, title, message, data)
      values (
        post_owner_id,
        'like',
        'New Like',
        'Someone liked your post',
        jsonb_build_object('post_id', new.post_id, 'liker_id', new.user_id)
      );
    end if;
    return new;
  elsif (TG_OP = 'DELETE') then
    -- Update like count
    update public.posts set likes_count = likes_count - 1 where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_post_like_change on public.post_likes;
create trigger on_post_like_change
  after insert or delete on public.post_likes
  for each row execute procedure public.handle_post_like_engagement();
