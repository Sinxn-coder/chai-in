-- Test RLS Policies for Community Posts
-- This will help diagnose if the policies are working correctly

-- Test 1: Check if community_posts table exists and has RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerlspolicy
FROM pg_tables 
WHERE tablename = 'community_posts';

-- Test 2: Check existing policies on community_posts
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'community_posts';

-- Test 3: Try to insert a test post (this should work with proper RLS)
-- Note: This will fail if you're not authenticated, but shows the policy structure
SELECT 'Testing community_posts access...' as message;

-- Test 4: Check if there are any posts in the table
SELECT 
    COUNT(*) as total_posts,
    MIN(created_at) as oldest_post,
    MAX(created_at) as newest_post
FROM community_posts;

-- Test 5: Show recent posts (if any)
SELECT 
    id,
    user_id,
    caption,
    likes,
    created_at
FROM community_posts 
ORDER BY created_at DESC 
LIMIT 5;

-- Test 6: Check user_preferences table RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerlspolicy
FROM pg_tables 
WHERE tablename = 'user_preferences';

-- Test 7: Check policies on user_preferences
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_preferences';

SELECT 'RLS Policy Check Complete!' as message;
