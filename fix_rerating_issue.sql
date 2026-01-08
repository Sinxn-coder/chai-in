-- Fix rating re-rating issue with proper RLS policies

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view all ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can insert their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can upsert their own ratings" ON spot_ratings;

-- Create simple, working RLS policies
CREATE POLICY "Enable read access for all users" ON spot_ratings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON spot_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own ratings" ON spot_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own ratings" ON spot_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Make sure RLS is enabled
ALTER TABLE spot_ratings ENABLE ROW LEVEL SECURITY;

-- Grant proper permissions
GRANT ALL ON spot_ratings TO authenticated;
GRANT SELECT ON spot_ratings TO anon;

SELECT 'Rating policies fixed for re-rating!' as message;
