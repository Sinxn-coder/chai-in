-- Add broadcast_id column to notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS broadcast_id UUID;

-- Update the broadcast function to use a generated broadcast_id
CREATE OR REPLACE FUNCTION public.broadcast_notification(
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_broadcast_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data, broadcast_id)
  SELECT id, p_type, p_title, p_message, p_data || jsonb_build_object('broadcast_id', v_broadcast_id), v_broadcast_id
  FROM public.users;
END;
$$;
