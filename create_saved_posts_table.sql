-- Create saved_posts table
CREATE TABLE IF NOT EXISTS saved_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id) -- Prevent duplicate saves
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_post_id ON saved_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_created_at ON saved_posts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own saved posts
CREATE POLICY "Users can manage their own saved posts" ON saved_posts
    FOR ALL USING (auth.uid() = user_id);

-- Create policy for users to view their own saved posts
CREATE POLICY "Users can view their own saved posts" ON saved_posts
    FOR SELECT USING (auth.uid() = user_id);
