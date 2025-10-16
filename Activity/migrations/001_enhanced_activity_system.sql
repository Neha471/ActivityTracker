-- Enhanced Activity Tracking System Migration
-- This migration adds support for categories, activity logs, streaks, and enhanced activity metadata

-- Drop existing activities table if it exists (modify as needed)
-- DROP TABLE IF EXISTS neha.activities CASCADE;

-- Create categories table
CREATE TABLE IF NOT EXISTS neha.activity_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
    icon VARCHAR(10) DEFAULT '📝',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Create enhanced activities table
CREATE TABLE IF NOT EXISTS neha.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES neha.activity_categories(id) ON DELETE CASCADE,
    frequency_type VARCHAR(20) NOT NULL CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'custom')),
    frequency_value INTEGER NOT NULL DEFAULT 1,
    frequency_period VARCHAR(10) CHECK (frequency_period IN ('day', 'week', 'month')),
    frequency_specific_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
    icon VARCHAR(10) DEFAULT '📝',
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    streak INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    consistency DECIMAL(5,2) DEFAULT 0.0,
    last_completed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity logs table for tracking daily completions
CREATE TABLE IF NOT EXISTS neha.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES neha.activities(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'missed', 'pending')),
    notes TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(activity_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON neha.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_category_id ON neha.activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_id ON neha.activity_logs(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON neha.activity_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON neha.activity_logs(date);
CREATE INDEX IF NOT EXISTS idx_activity_categories_user_id ON neha.activity_categories(user_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
CREATE TRIGGER update_activities_updated_at 
    BEFORE UPDATE ON neha.activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_categories_updated_at 
    BEFORE UPDATE ON neha.activity_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_logs_updated_at 
    BEFORE UPDATE ON neha.activity_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories for existing users (optional)
-- You can run this after the migration if needed
INSERT INTO neha.activity_categories (user_id, name, color, icon) 
VALUES 
    (1, 'Reading', '#10b981', '📚'),
    (1, 'Fitness', '#ef4444', '💪'),
    (1, 'Learning', '#6366f1', '🎓'),
    (1, 'Health', '#8b5cf6', '🏥'),
    (1, 'Work', '#f59e0b', '💼')
ON CONFLICT (user_id, name) DO NOTHING;

-- Function to calculate activity streak
CREATE OR REPLACE FUNCTION calculate_activity_streak(activity_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date_check DATE := CURRENT_DATE;
    log_status VARCHAR(20);
BEGIN
    -- Loop backwards from today to find consecutive completed days
    LOOP
        SELECT status INTO log_status
        FROM neha.activity_logs
        WHERE activity_id = activity_uuid AND date = current_date_check;
        
        -- If no log found or status is not completed, break the streak
        IF log_status IS NULL OR log_status != 'completed' THEN
            EXIT;
        END IF;
        
        -- If completed, increment streak and check previous day
        streak_count := streak_count + 1;
        current_date_check := current_date_check - INTERVAL '1 day';
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate consistency percentage
CREATE OR REPLACE FUNCTION calculate_consistency_percentage(activity_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS DECIMAL AS $$
DECLARE
    total_expected INTEGER;
    total_completed INTEGER;
    consistency_pct DECIMAL(5,2);
BEGIN
    -- Get total expected completions based on frequency
    -- This is a simplified calculation - you may want to enhance based on specific frequency rules
    SELECT COUNT(*)
    INTO total_expected
    FROM neha.activity_logs
    WHERE activity_id = activity_uuid
    AND date >= CURRENT_DATE - INTERVAL '1 day' * days_back
    AND date <= CURRENT_DATE;
    
    -- Get total completed
    SELECT COUNT(*)
    INTO total_completed
    FROM neha.activity_logs
    WHERE activity_id = activity_uuid
    AND date >= CURRENT_DATE - INTERVAL '1 day' * days_back
    AND date <= CURRENT_DATE
    AND status = 'completed';
    
    -- Calculate percentage
    IF total_expected = 0 THEN
        consistency_pct := 0;
    ELSE
        consistency_pct := (total_completed::DECIMAL / total_expected::DECIMAL) * 100;
    END IF;
    
    RETURN ROUND(consistency_pct, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update activity stats (to be called after each log entry)
CREATE OR REPLACE FUNCTION update_activity_stats(activity_uuid UUID)
RETURNS VOID AS $$
DECLARE
    new_streak INTEGER;
    new_consistency DECIMAL(5,2);
    new_total_completions INTEGER;
    last_completion TIMESTAMP;
BEGIN
    -- Calculate new streak
    new_streak := calculate_activity_streak(activity_uuid);
    
    -- Calculate new consistency
    new_consistency := calculate_consistency_percentage(activity_uuid);
    
    -- Get total completions
    SELECT COUNT(*), MAX(completed_at)
    INTO new_total_completions, last_completion
    FROM neha.activity_logs
    WHERE activity_id = activity_uuid AND status = 'completed';
    
    -- Update activity record
    UPDATE neha.activities
    SET 
        streak = new_streak,
        consistency = new_consistency,
        total_completions = new_total_completions,
        last_completed = last_completion,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = activity_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update activity stats when logs change
CREATE OR REPLACE FUNCTION trigger_update_activity_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stats for the affected activity
    IF TG_OP = 'DELETE' THEN
        PERFORM update_activity_stats(OLD.activity_id);
        RETURN OLD;
    ELSE
        PERFORM update_activity_stats(NEW.activity_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_logs_update_stats
    AFTER INSERT OR UPDATE OR DELETE ON neha.activity_logs
    FOR EACH ROW EXECUTE FUNCTION trigger_update_activity_stats();

-- Grant necessary permissions (adjust user as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA neha TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA neha TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA neha TO your_app_user;