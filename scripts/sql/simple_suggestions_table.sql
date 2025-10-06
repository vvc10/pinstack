-- Simple suggestions table for quick setup
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('feature-request', 'suggestion')),
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all suggestions" ON suggestions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own suggestions" ON suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggestions" ON suggestions
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON suggestions TO authenticated;
