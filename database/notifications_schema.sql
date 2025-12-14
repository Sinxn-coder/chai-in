-- Notifications table for admin to send notifications to users
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- User notifications read status
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, notification_id)
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications (everyone can read active notifications)
CREATE POLICY "Anyone can view active notifications"
    ON notifications FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (TRUE); -- You should add admin check here

CREATE POLICY "Admins can update notifications"
    ON notifications FOR UPDATE
    USING (TRUE); -- You should add admin check here

-- Policies for user_notifications
CREATE POLICY "Users can view their own notification status"
    ON user_notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification status"
    ON user_notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification status"
    ON user_notifications FOR UPDATE
    USING (auth.uid() = user_id);
