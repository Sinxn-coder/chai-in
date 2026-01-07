-- Fix rating policies - run this if you get "already exists" errors

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view all ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can insert their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON spot_ratings;
DROP POLICY IF EXISTS "Users can upsert their own ratings" ON spot_ratings;

-- Create clean RLS policies for ratings
CREATE POLICY "Users can view all ratings" ON spot_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON spot_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON spot_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON spot_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Combined policy for all operations (including upsert)
CREATE POLICY "Users can upsert their own ratings" ON spot_ratings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON spot_ratings TO authenticated;
GRANT SELECT ON spot_ratings TO anon;

-- Make sure the function and trigger exist
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

SELECT 'Rating policies fixed successfully!' as message;
