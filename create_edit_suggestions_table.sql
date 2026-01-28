-- Create table for spot edit suggestions
CREATE TABLE IF NOT EXISTS spot_edit_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spot_id BIGINT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    suggested_changes JSONB NOT NULL, -- What fields were changed
    original_data JSONB NOT NULL, -- Original spot data
    suggested_data JSONB NOT NULL, -- Complete suggested data
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spot_edit_suggestions_spot_id ON spot_edit_suggestions(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_edit_suggestions_user_id ON spot_edit_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_spot_edit_suggestions_status ON spot_edit_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_spot_edit_suggestions_created_at ON spot_edit_suggestions(created_at DESC);

-- Enable RLS
ALTER TABLE spot_edit_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own suggestions" ON spot_edit_suggestions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create suggestions" ON spot_edit_suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Simple admin policy - allow all authenticated users to view/update (since admin is protected by PIN)
CREATE POLICY "Admins can view all suggestions" ON spot_edit_suggestions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update suggestions" ON spot_edit_suggestions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON spot_edit_suggestions TO authenticated;
GRANT ALL ON spot_edit_suggestions TO service_role;

SELECT 'Spot edit suggestions table created successfully!' as message;
 