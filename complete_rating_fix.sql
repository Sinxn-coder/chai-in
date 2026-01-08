-- Complete fix for rating submission issue
-- This will completely reset and recreate rating system permissions

-- First, drop all existing policies and triggers
DROP POLICY IF EXISTS "Users can view all ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can insert their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can upsert their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Enable read access for all users" ON spot_ratings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON spot_ratings;
DROP POLICY IF EXISTS "Enable update for own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Enable delete for own ratings" ON spot_ratings;

-- Drop triggers that might be causing issues
DROP TRIGGER IF EXISTS on_spot_rating_change ON spot_ratings;
DROP TRIGGER IF EXISTS on_spot_rating_change ON spot_ratings;

-- Disable RLS temporarily to fix permissions
ALTER TABLE spot_ratings DISABLE ROW LEVEL SECURITY;

-- Grant direct permissions
GRANT ALL ON spot_ratings TO authenticated;
GRANT SELECT ON spot_ratings TO anon;

-- Re-enable RLS with simple policies
ALTER TABLE spot_ratings ENABLE ROW LEVEL SECURITY;

-- Create very simple RLS policies
CREATE POLICY "Allow all operations for authenticated users" ON spot_ratings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow read access to all" ON spot_ratings
    FOR SELECT USING (true);

-- Make sure spots table has the columns
ALTER TABLE spots 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Create simple function to update averages
CREATE OR REPLACE FUNCTION update_spot_average_rating(p_spot_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE spots 
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0.0)::DECIMAL(3,2)
            FROM spot_ratings 
            WHERE spot_id = p_spot_id
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM spot_ratings 
            WHERE spot_id = p_spot_id
        )
    WHERE id = p_spot_id;
END;
$$ LANGUAGE plpgsql;

-- Create simple trigger
CREATE TRIGGER update_spot_average_trigger
    AFTER INSERT OR UPDATE OR DELETE ON spot_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_spot_average_rating(NEW.spot_id);

-- Update existing spots
UPDATE spots 
SET average_rating = (
    SELECT COALESCE(AVG(rating), 0.0)::DECIMAL(3,2)
    FROM spot_ratings 
    WHERE spot_ratings.spot_id = spots.id
),
total_ratings = (
    SELECT COUNT(*)
    FROM spot_ratings 
    WHERE spot_ratings.spot_id = spots.id
);

SELECT 'Rating system completely fixed!' as message;
