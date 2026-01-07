-- Fix RLS Policies for Admin Operations and Community Posts
-- This script will fix the permission issues preventing admin verification and community posts

-- First, drop existing policies on spots table (ignore if they don't exist)
DROP POLICY IF EXISTS "users_can_insert_own_spots" ON spots;
DROP POLICY IF EXISTS "users_can_update_own_spots" ON spots;
DROP POLICY IF EXISTS "users_can_delete_own_spots" ON spots;
DROP POLICY IF EXISTS "users_can_view_all_spots" ON spots;

-- Create new policies that allow admin operations
-- Policy for viewing spots (everyone can view)
CREATE POLICY "users_can_view_all_spots" ON spots
    FOR SELECT USING (true);

-- Policy for inserting spots (authenticated users can insert)
CREATE POLICY "users_can_insert_spots" ON spots
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating spots (authenticated users can update, OR admin service role)
CREATE POLICY "users_can_update_spots" ON spots
    FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy for deleting spots (authenticated users can delete, OR admin service role)
CREATE POLICY "users_can_delete_spots" ON spots
    FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON spots TO authenticated;
GRANT ALL ON spots TO service_role;
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- Fix community_posts table policies
DROP POLICY IF EXISTS "users_can_insert_own_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_update_own_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_delete_own_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_view_all_posts" ON community_posts;

-- Create policies for community posts
-- Policy for viewing posts (everyone can view)
CREATE POLICY "users_can_view_all_posts" ON community_posts
    FOR SELECT USING (true);

-- Policy for inserting posts (authenticated users can insert)
CREATE POLICY "users_can_insert_posts" ON community_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating posts (users can update their own posts)
CREATE POLICY "users_can_update_own_posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for deleting posts (users can delete their own posts)
CREATE POLICY "users_can_delete_own_posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions for community posts
GRANT ALL ON community_posts TO authenticated;
GRANT ALL ON community_posts TO service_role;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Fix post_likes table policies
DROP POLICY IF EXISTS "users_can_manage_own_likes" ON post_likes;
DROP POLICY IF EXISTS "users_can_view_all_likes" ON post_likes;

CREATE POLICY "users_can_manage_own_likes" ON post_likes
    FOR ALL USING (auth.uid() = user_id);

GRANT ALL ON post_likes TO authenticated;
GRANT ALL ON post_likes TO service_role;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Fix post_comments table policies
DROP POLICY IF EXISTS "users_can_manage_own_comments" ON post_comments;
DROP POLICY IF EXISTS "users_can_view_all_comments" ON post_comments;

CREATE POLICY "users_can_manage_own_comments" ON post_comments
    FOR ALL USING (auth.uid() = user_id);

GRANT ALL ON post_comments TO authenticated;
GRANT ALL ON post_comments TO service_role;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Also fix user_preferences table policies
DROP POLICY IF EXISTS "users_can_view_own_preferences" ON user_preferences;
DROP POLICY IF EXISTS "users_can_insert_own_preferences" ON user_preferences;
DROP POLICY IF EXISTS "users_can_update_own_preferences" ON user_preferences;

CREATE POLICY "users_can_manage_own_preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON user_preferences TO service_role;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Output message
SELECT 'RLS policies updated successfully for all tables!' as message;
