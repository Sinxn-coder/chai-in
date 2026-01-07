-- Create ratings table for spots
CREATE TABLE IF NOT EXISTS spot_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spot_id BIGINT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(spot_id, user_id) -- One rating per user per spot
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spot_ratings_spot_id ON spot_ratings(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_ratings_user_id ON spot_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_spot_ratings_rating ON spot_ratings(rating);

-- Add average_rating and total_ratings columns to spots table
ALTER TABLE spots 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE spot_ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ratings
CREATE POLICY "Users can view all ratings" ON spot_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON spot_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON spot_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON spot_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Additional policy to allow upsert operations
CREATE POLICY "Users can upsert their own ratings" ON spot_ratings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON spot_ratings TO authenticated;
GRANT SELECT ON spot_ratings TO anon;

-- Create function to update spot average rating
CREATE OR REPLACE FUNCTION update_spot_average_rating(p_spot_id BIGINT)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    total_count INTEGER;
BEGIN
    SELECT 
        COALESCE(AVG(rating), 0.0)::DECIMAL(3,2),
        COUNT(*)
    INTO avg_rating, total_count
    FROM spot_ratings
    WHERE spot_id = p_spot_id;
    
    UPDATE spots
    SET average_rating = avg_rating,
        total_ratings = total_count
    WHERE id = p_spot_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update average rating
CREATE OR REPLACE FUNCTION trigger_update_spot_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        PERFORM update_spot_average_rating(NEW.spot_id);
        RETURN COALESCE(NEW, OLD);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS on_spot_rating_change ON spot_ratings;
CREATE TRIGGER on_spot_rating_change
    AFTER INSERT OR UPDATE OR DELETE ON spot_ratings
    FOR EACH ROW EXECUTE FUNCTION trigger_update_spot_rating();

-- Update existing spots with calculated averages
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

SELECT 'Rating system created successfully!' as message;
