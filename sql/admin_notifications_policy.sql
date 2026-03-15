-- Allow admins to insert notifications for any user
-- This requires the 'is_admin' column in public.users to be correctly set for the admin user

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;

-- Create the insert policy for admins
CREATE POLICY "Admins can insert notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- Also ensure admins can view all notifications for debugging
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
CREATE POLICY "Admins can view all notifications" 
  ON public.notifications FOR SELECT 
  USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );
