-- Complete RLS Policy Reset
-- This will drop ALL existing policies and recreate them properly

-- Disable RLS temporarily to avoid conflicts
ALTER TABLE spots DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on all tables
DROP POLICY IF EXISTS "users_can_insert_own_spots" ON spots;
DROP POLICY IF EXISTS "users_can_update_own_spots" ON spots;
DROP POLICY IF EXISTS "users_can_delete_own_spots" ON spots;
DROP POLICY IF EXISTS "users_can_view_all_spots" ON spots;
DROP POLICY IF EXISTS "users_can_insert_spots" ON spots;
DROP POLICY IF EXISTS "users_can_update_spots" ON spots;
DROP POLICY IF EXISTS "users_can_delete_spots" ON spots;

DROP POLICY IF EXISTS "users_can_insert_own_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_update_own_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_delete_own_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_view_all_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_insert_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_update_own_posts" ON community_posts;
DROP POLICY IF EXISTS "users_can_delete_own_posts" ON community_posts;

DROP POLICY IF EXISTS "users_can_manage_own_likes" ON post_likes;
DROP POLICY IF EXISTS "users_can_view_all_likes" ON post_likes;

DROP POLICY IF EXISTS "users_can_manage_own_comments" ON post_comments;
DROP POLICY IF EXISTS "users_can_view_all_comments" ON post_comments;

DROP POLICY IF EXISTS "users_can_view_own_preferences" ON user_preferences;
DROP POLICY IF EXISTS "users_can_insert_own_preferences" ON user_preferences;
DROP POLICY IF EXISTS "users_can_update_own_preferences" ON user_preferences;

-- Now create clean new policies for spots table
CREATE POLICY "enable_public_spot_access" ON spots
    FOR SELECT USING (true);

CREATE POLICY "enable_authenticated_spot_insert" ON spots
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "enable_spot_update" ON spots
    FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "enable_spot_delete" ON spots
    FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Create clean policies for community_posts table
CREATE POLICY "enable_public_post_access" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "enable_authenticated_post_insert" ON community_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "enable_own_post_update" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "enable_own_post_delete" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Create clean policies for post_likes table
CREATE POLICY "enable_own_like_management" ON post_likes
    FOR ALL USING (auth.uid() = user_id);

-- Create clean policies for post_comments table
CREATE POLICY "enable_own_comment_management" ON post_comments
    FOR ALL USING (auth.uid() = user_id);

-- Create clean policies for user_preferences table
CREATE POLICY "enable_own_preference_management" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON spots TO authenticated;
GRANT ALL ON spots TO service_role;
GRANT ALL ON community_posts TO authenticated;
GRANT ALL ON community_posts TO service_role;
GRANT ALL ON post_likes TO authenticated;
GRANT ALL ON post_likes TO service_role;
GRANT ALL ON post_comments TO authenticated;
GRANT ALL ON post_comments TO service_role;
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON user_preferences TO service_role;

-- Re-enable RLS
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Output message
SELECT 'All RLS policies have been reset and recreated successfully!' as message;
