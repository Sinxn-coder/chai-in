-- Add 24-hour support to spots table
ALTER TABLE public.spots 
ADD COLUMN is_24_hours BOOLEAN DEFAULT false;

-- Optional: Update existing spots if needed
-- UPDATE public.spots SET is_24_hours = false;
