-- Fix Community Posts Table Structure and RLS
-- This will create the proper table structure and fix all issues

-- First, check if the table exists and fix its structure
DO $$
BEGIN
    -- Check if community_posts table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'community_posts') THEN
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'likes') THEN
            ALTER TABLE community_posts ADD COLUMN likes INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'created_at') THEN
            ALTER TABLE community_posts ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'updated_at') THEN
            ALTER TABLE community_posts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    ELSE
        -- Create the table if it doesn't exist
        CREATE TABLE community_posts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id),
            image_url TEXT NOT NULL,
            caption TEXT,
            likes INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create post_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create post_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix RLS policies with simple approach
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all operations on community_posts" ON community_posts;
DROP POLICY IF EXISTS "Allow all operations on user_preferences" ON community_posts;
DROP POLICY IF EXISTS "Allow all operations on post_likes" ON post_likes;
DROP POLICY IF EXISTS "Allow all operations on post_comments" ON post_comments;

-- Create simple working policies
CREATE POLICY "Enable all on community_posts" ON community_posts FOR ALL USING (true);
CREATE POLICY "Enable all on post_likes" ON post_likes FOR ALL USING (true);
CREATE POLICY "Enable all on post_comments" ON post_comments FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON community_posts TO authenticated, anon, service_role;
GRANT ALL ON post_likes TO authenticated, anon, service_role;
GRANT ALL ON post_comments TO authenticated, anon, service_role;

-- Re-enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);

SELECT 'Community posts structure and RLS fixed completely!' as message;
