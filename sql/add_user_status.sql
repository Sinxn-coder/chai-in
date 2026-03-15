-- Add status column to public.users table
ALTER TABLE public.users ADD COLUMN status text DEFAULT 'active';

-- Update existing users to 'active' status if not already set
UPDATE public.users SET status = 'active' WHERE status IS NULL;
