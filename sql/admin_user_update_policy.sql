-- Allow admins to update status and other fields for any user
-- This requires the 'is_admin' column in public.users to be correctly set for the admin user

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can update any user profile" ON public.users;

-- Create the update policy for admins
CREATE POLICY "Admins can update any user profile" 
  ON public.users FOR UPDATE
  USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  )
  WITH CHECK (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- IMPORTANT: Ensure the admin user is actually marked as an admin in the database
UPDATE public.users SET is_admin = true WHERE email = 'bytspot.in@gmail.com';
