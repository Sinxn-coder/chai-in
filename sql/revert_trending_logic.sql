-- Revert Trending Spots by Visit Count changes
-- This removes the visit_count column and its associated trigger logic
-- while keeping the visits table intact.

-- 1. Drop the trigger from visits table
drop trigger if exists on_visit_change on public.visits;

-- 2. Drop the trigger function
drop function if exists public.update_spot_visit_count();

-- 3. Remove the visit_count column from spots table
alter table public.spots drop column if exists visit_count;
