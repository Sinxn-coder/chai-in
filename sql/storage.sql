-- 1. Create profiles bucket (if it doesn't exist)
insert into storage.buckets (id, name, public) 
values ('profiles', 'profiles', true)
on conflict (id) do nothing;

-- 2. Storage Policies (dropping first to avoid "already exists" errors)
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select using (bucket_id = 'profiles');

drop policy if exists "Anyone can upload an avatar" on storage.objects;
create policy "Anyone can upload an avatar"
  on storage.objects for insert with check (bucket_id = 'profiles');

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update using (auth.uid() = owner);
