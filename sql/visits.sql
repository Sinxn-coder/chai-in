-- Visits Table Definition

create table if not exists public.visits (
  user_id uuid references public.users(id) on delete cascade,
  spot_id uuid references public.spots(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, spot_id)
);

-- Enable RLS
alter table public.visits enable row level security;

-- RLS Policies
drop policy if exists "Users can manage their own visits" on public.visits;
create policy "Users can manage their own visits" 
  on public.visits for all 
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger to update spot visit count
create or replace function public.update_spot_visit_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.spots
    set visit_count = visit_count + 1
    where id = new.spot_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.spots
    set visit_count = visit_count - 1
    where id = old.spot_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists on_visit_change on public.visits;
create trigger on_visit_change
  after insert or delete on public.visits
  for each row execute procedure public.update_spot_visit_count();
