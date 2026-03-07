-- 1. Create users table
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  full_name text,
  username text unique,
  avatar_url text,
  city text,
  is_admin boolean default false,
  username_last_changed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.users enable row level security;

-- 3. Create RLS Policies
create policy "Public profiles are viewable by everyone" 
  on public.users for select using (true);

create policy "Users can update their own profile" 
  on public.users for update using (auth.uid() = id);

-- 4. Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- 5. Create trigger for auth sync (Google Login support)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
