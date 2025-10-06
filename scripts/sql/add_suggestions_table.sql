-- Create suggestions table for storing user feedback and feature requests
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('feature-request', 'suggestion')),
    title VARCHAR(255),
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'approved', 'rejected', 'implemented')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    admin_notes TEXT,
    votes_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_type ON suggestions(type);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_priority ON suggestions(priority);

-- Create votes table for suggestion voting
CREATE TABLE IF NOT EXISTS suggestion_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(suggestion_id, user_id)
);

-- Create index for votes
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_suggestion_id ON suggestion_votes(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_user_id ON suggestion_votes(user_id);

-- Create function to update votes count
CREATE OR REPLACE FUNCTION update_suggestion_votes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE suggestions 
        SET votes_count = (
            SELECT COUNT(*) 
            FROM suggestion_votes 
            WHERE suggestion_id = NEW.suggestion_id AND vote_type = 'up'
        ) - (
            SELECT COUNT(*) 
            FROM suggestion_votes 
            WHERE suggestion_id = NEW.suggestion_id AND vote_type = 'down'
        )
        WHERE id = NEW.suggestion_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE suggestions 
        SET votes_count = (
            SELECT COUNT(*) 
            FROM suggestion_votes 
            WHERE suggestion_id = OLD.suggestion_id AND vote_type = 'up'
        ) - (
            SELECT COUNT(*) 
            FROM suggestion_votes 
            WHERE suggestion_id = OLD.suggestion_id AND vote_type = 'down'
        )
        WHERE id = OLD.suggestion_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update votes count
CREATE TRIGGER trigger_update_suggestion_votes_count
    AFTER INSERT OR UPDATE OR DELETE ON suggestion_votes
    FOR EACH ROW EXECUTE FUNCTION update_suggestion_votes_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER trigger_update_suggestions_updated_at
    BEFORE UPDATE ON suggestions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for suggestions
CREATE POLICY "Users can view public suggestions" ON suggestions
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own suggestions" ON suggestions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suggestions" ON suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggestions" ON suggestions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suggestions" ON suggestions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for suggestion_votes
CREATE POLICY "Users can view all votes" ON suggestion_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own votes" ON suggestion_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON suggestion_votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON suggestion_votes
    FOR DELETE USING (auth.uid() = user_id);

-- Insert some sample data (optional)
INSERT INTO suggestions (user_id, type, title, description, status, priority) VALUES
    (auth.uid(), 'feature-request', 'Dark Mode Toggle', 'Add a dark mode toggle in the settings panel for better user experience', 'pending', 'medium'),
    (auth.uid(), 'suggestion', 'Better Search', 'Improve the search functionality with filters and sorting options', 'pending', 'high')
ON CONFLICT DO NOTHING;

-- Create a view for public suggestions with vote counts
CREATE OR REPLACE VIEW public_suggestions AS
SELECT 
    s.id,
    s.type,
    s.title,
    s.description,
    s.status,
    s.priority,
    s.created_at,
    s.updated_at,
    s.votes_count,
    s.is_public,
    u.email as author_email,
    CASE 
        WHEN s.user_id = auth.uid() THEN true 
        ELSE false 
    END as is_owner
FROM suggestions s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE s.is_public = true
ORDER BY s.votes_count DESC, s.created_at DESC;

-- Grant permissions
GRANT SELECT ON public_suggestions TO authenticated;
GRANT ALL ON suggestions TO authenticated;
GRANT ALL ON suggestion_votes TO authenticated;
