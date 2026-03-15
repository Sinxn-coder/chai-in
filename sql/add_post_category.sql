-- Add category column to posts table
alter table public.posts 
add column if not exists category text default 'discussion';

-- Update RLS if needed (not strictly required for a simple column add but good practice)
-- All existing policies on posts still apply to the new column automatically.
