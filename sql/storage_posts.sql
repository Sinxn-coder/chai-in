-- Storage bucket for community post images

insert into storage.buckets (id, name, public) 
values ('posts', 'posts', true)
on conflict (id) do nothing;

-- 6. Posts Storage Policies
drop policy if exists "Post images are publicly accessible" on storage.objects;
create policy "Post images are publicly accessible"
  on storage.objects for select using (bucket_id = 'posts');

drop policy if exists "Authenticated users can upload post images" on storage.objects;
create policy "Authenticated users can upload post images"
  on storage.objects for insert with check (bucket_id = 'posts' and auth.role() = 'authenticated');

drop policy if exists "Users can delete their own post images" on storage.objects;
create policy "Users can delete their own post images"
  on storage.objects for delete using (bucket_id = 'posts' and (auth.uid() = owner or (select is_admin from public.users where id = auth.uid())));
