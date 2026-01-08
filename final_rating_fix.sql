-- Final working fix for rating system

-- Drop everything first
DROP TRIGGER IF EXISTS update_spot_average_trigger ON spot_ratings;
DROP TRIGGER IF EXISTS on_spot_rating_change ON spot_ratings;
DROP TRIGGER IF EXISTS on_spot_rating_change ON spot_ratings;
DROP FUNCTION IF EXISTS update_spot_average_rating(BIGINT);
DROP POLICY IF EXISTS "Users can view all ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can insert their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can upsert their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Enable read access for all users" ON spot_ratings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON spot_ratings;
DROP POLICY IF EXISTS "Enable update for own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Enable delete for own ratings" ON spot_ratings;

-- Make sure table exists and has columns
CREATE TABLE IF NOT EXISTS spot_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spot_id BIGINT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(spot_id, user_id)
);

-- Add columns to spots table
ALTER TABLE spots 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_spot_ratings_spot_id ON spot_ratings(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_ratings_user_id ON spot_ratings(user_id);

-- Enable RLS
ALTER TABLE spot_ratings ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies
CREATE POLICY "Users can view all ratings" ON spot_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own ratings" ON spot_ratings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON spot_ratings TO authenticated;
GRANT SELECT ON spot_ratings TO anon;

-- Create function to update averages
CREATE OR REPLACE FUNCTION update_spot_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE spots 
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0.0)::DECIMAL(3,2)
            FROM spot_ratings 
            WHERE spot_id = COALESCE(NEW.spot_id, OLD.spot_id)
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM spot_ratings 
            WHERE spot_id = COALESCE(NEW.spot_id, OLD.spot_id)
        )
    WHERE id = COALESCE(NEW.spot_id, OLD.spot_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_spot_average_trigger
    AFTER INSERT OR UPDATE OR DELETE ON spot_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_spot_average_rating();

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

SELECT 'Rating system fixed successfully!' as message;
