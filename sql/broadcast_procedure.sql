-- Create a function to broadcast notifications to all users
-- This is more efficient than inserting user by user from the client

CREATE OR REPLACE FUNCTION public.broadcast_notification(
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to insert for all users
AS $$
BEGIN
  -- Check if the invoker is an admin (optional check, as it's SECURITY DEFINER)
  -- If you want only admins to call it, uncomment below:
  -- IF NOT (SELECT is_admin FROM public.users WHERE id = auth.uid()) THEN
  --   RAISE EXCEPTION 'Only admins can broadcast notifications';
  -- END IF;

  INSERT INTO public.notifications (user_id, type, title, message, data)
  SELECT id, p_type, p_title, p_message, p_data
  FROM public.users;
END;
$$;

-- Grant execution permission to authenticated users (admins)
GRANT EXECUTE ON FUNCTION public.broadcast_notification(text, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.broadcast_notification(text, text, text, jsonb) TO service_role;
