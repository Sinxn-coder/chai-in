-- Storage bucket for spot images

insert into storage.buckets (id, name, public) 
values ('spots', 'spots', true)
on conflict (id) do nothing;

-- 4. Spots Storage Policies
drop policy if exists "Spot images are publicly accessible" on storage.objects;
create policy "Spot images are publicly accessible"
  on storage.objects for select using (bucket_id = 'spots');

drop policy if exists "Authenticated users can upload spot images" on storage.objects;
create policy "Authenticated users can upload spot images"
  on storage.objects for insert with check (bucket_id = 'spots' and auth.role() = 'authenticated');

drop policy if exists "Users can delete their own spot images" on storage.objects;
create policy "Users can delete their own spot images"
  on storage.objects for delete using (bucket_id = 'spots' and (auth.uid() = owner or (select is_admin from public.users where id = auth.uid())));
