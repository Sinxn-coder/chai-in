-- Add spot mention columns to public.posts
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS spot_id uuid REFERENCES public.spots(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS spot_name text;
