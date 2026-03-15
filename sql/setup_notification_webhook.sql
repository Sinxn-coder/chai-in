-- Step 1: Enable the net extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- Step 2: Create a function to trigger the push-relay Edge Function
CREATE OR REPLACE FUNCTION public.trigger_push_relay()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only trigger if send_push is true in the data JSONB field
  IF (NEW.data ? 'send_push' AND (NEW.data->>'send_push')::boolean = true) THEN
    -- Perform an asynchronous HTTP POST to the Edge Function
    -- Replace <PROJECT_REF> with your actual Supabase project reference
    -- Replace <ANON_KEY> with your Supabase Anon Key (or Service Role Key if restricted)
    PERFORM
      extensions.http_post(
        'https://axitmdzhuwllrgbzxlzq.supabase.co/functions/v1/push-relay',
        jsonb_build_object(
          'record', jsonb_build_object(
            'id', NEW.id,
            'user_id', NEW.user_id,
            'title', NEW.title,
            'message', NEW.message,
            'data', NEW.data
          )
        )::text,
        'application/json',
        jsonb_build_object(
          'Authorization', 'Bearer sb_publishable_s3H1Bl16De43nODemXRNYw_rGDvfghZ'
        )::text
      );
  END IF;
  RETURN NEW;
END;
$$;

-- Step 3: Create the trigger on the notifications table
DROP TRIGGER IF EXISTS on_notification_created_push ON public.notifications;
CREATE TRIGGER on_notification_created_push
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_push_relay();
