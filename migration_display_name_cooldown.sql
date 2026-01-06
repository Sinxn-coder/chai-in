-- Add last_display_name_change column to user_preferences table
-- This column tracks when the user last changed their display name
-- Used to enforce 24-hour cooldown for display name changes

ALTER TABLE user_preferences 
ADD COLUMN last_display_name_change TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the purpose
COMMENT ON COLUMN user_preferences.last_display_name_change IS 'Timestamp of last display name change for 24-hour cooldown enforcement';
