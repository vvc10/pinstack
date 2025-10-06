-- pinstack Database Schema
-- This file contains all the necessary tables and relationships for the pinstack application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE pin_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE hackathon_status AS ENUM ('upcoming', 'active', 'ended', 'cancelled');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    github_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    role user_role DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pins table
CREATE TABLE IF NOT EXISTS pins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    video_url TEXT,
    demo_url TEXT,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
    status pin_status DEFAULT 'published',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pin likes table
CREATE TABLE IF NOT EXISTS pin_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pin_id UUID REFERENCES pins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pin_id, user_id)
);

-- Pin saves table
CREATE TABLE IF NOT EXISTS pin_saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pin_id UUID REFERENCES pins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pin_id, user_id, board_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    pin_id UUID REFERENCES pins(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    rules TEXT,
    prizes TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status hackathon_status DEFAULT 'upcoming',
    cover_image_url TEXT,
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hackathon submissions table
CREATE TABLE IF NOT EXISTS hackathon_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    repository_url TEXT,
    demo_url TEXT,
    status submission_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hackathon_id, participant_id)
);

-- Hackathon votes table
CREATE TABLE IF NOT EXISTS hackathon_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES hackathon_submissions(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(submission_id, voter_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_duration INTEGER, -- in hours
    is_published BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning path steps table
CREATE TABLE IF NOT EXISTS learning_path_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    step_order INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User learning progress table
CREATE TABLE IF NOT EXISTS user_learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    step_id UUID REFERENCES learning_path_steps(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, step_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pins_author_id ON pins(author_id);
CREATE INDEX IF NOT EXISTS idx_pins_board_id ON pins(board_id);
CREATE INDEX IF NOT EXISTS idx_pins_created_at ON pins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pins_language ON pins(language);
CREATE INDEX IF NOT EXISTS idx_pins_tags ON pins USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_pins_status ON pins(status);

CREATE INDEX IF NOT EXISTS idx_pin_likes_pin_id ON pin_likes(pin_id);
CREATE INDEX IF NOT EXISTS idx_pin_likes_user_id ON pin_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_pin_saves_pin_id ON pin_saves(pin_id);
CREATE INDEX IF NOT EXISTS idx_pin_saves_user_id ON pin_saves(user_id);

CREATE INDEX IF NOT EXISTS idx_comments_pin_id ON comments(pin_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);

CREATE INDEX IF NOT EXISTS idx_hackathons_status ON hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_dates ON hackathons(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pins_updated_at BEFORE UPDATE ON pins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hackathons_updated_at BEFORE UPDATE ON hackathons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hackathon_submissions_updated_at BEFORE UPDATE ON hackathon_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_path_steps_updated_at BEFORE UPDATE ON learning_path_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for updating counters
CREATE OR REPLACE FUNCTION update_pin_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE pins SET like_count = like_count + 1 WHERE id = NEW.pin_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE pins SET like_count = like_count - 1 WHERE id = OLD.pin_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_pin_save_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE pins SET save_count = save_count + 1 WHERE id = NEW.pin_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE pins SET save_count = save_count - 1 WHERE id = OLD.pin_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for counter updates
CREATE TRIGGER update_pin_like_count_trigger
    AFTER INSERT OR DELETE ON pin_likes
    FOR EACH ROW EXECUTE FUNCTION update_pin_like_count();

CREATE TRIGGER update_pin_save_count_trigger
    AFTER INSERT OR DELETE ON pin_saves
    FOR EACH ROW EXECUTE FUNCTION update_pin_save_count();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your needs)
-- Users can read all public profiles
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Boards are public for reading
CREATE POLICY "Boards are public for reading" ON boards FOR SELECT USING (true);

-- Users can create boards
CREATE POLICY "Users can create boards" ON boards FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own boards
CREATE POLICY "Users can update own boards" ON boards FOR UPDATE USING (auth.uid() = owner_id);

-- Pins are public for reading
CREATE POLICY "Pins are public for reading" ON pins FOR SELECT USING (status = 'published');

-- Users can create pins
CREATE POLICY "Users can create pins" ON pins FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own pins
CREATE POLICY "Users can update own pins" ON pins FOR UPDATE USING (auth.uid() = author_id);

-- Pin likes are public for reading
CREATE POLICY "Pin likes are public for reading" ON pin_likes FOR SELECT USING (true);

-- Users can manage their own likes
CREATE POLICY "Users can manage own likes" ON pin_likes FOR ALL USING (auth.uid() = user_id);

-- Pin saves are public for reading
CREATE POLICY "Pin saves are public for reading" ON pin_saves FOR SELECT USING (true);

-- Users can manage their own saves
CREATE POLICY "Users can manage own saves" ON pin_saves FOR ALL USING (auth.uid() = user_id);

-- Comments are public for reading
CREATE POLICY "Comments are public for reading" ON comments FOR SELECT USING (true);

-- Users can create comments
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);

-- Hackathons are public for reading
CREATE POLICY "Hackathons are public for reading" ON hackathons FOR SELECT USING (true);

-- Users can create hackathons
CREATE POLICY "Users can create hackathons" ON hackathons FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Users can update their own hackathons
CREATE POLICY "Users can update own hackathons" ON hackathons FOR UPDATE USING (auth.uid() = organizer_id);

-- Hackathon submissions are public for reading
CREATE POLICY "Hackathon submissions are public for reading" ON hackathon_submissions FOR SELECT USING (true);

-- Users can manage their own submissions
CREATE POLICY "Users can manage own submissions" ON hackathon_submissions FOR ALL USING (auth.uid() = participant_id);

-- Hackathon votes are public for reading
CREATE POLICY "Hackathon votes are public for reading" ON hackathon_votes FOR SELECT USING (true);

-- Users can manage their own votes
CREATE POLICY "Users can manage own votes" ON hackathon_votes FOR ALL USING (auth.uid() = voter_id);

-- Follows are public for reading
CREATE POLICY "Follows are public for reading" ON follows FOR SELECT USING (true);

-- Users can manage their own follows
CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (auth.uid() = follower_id);

-- Notifications are private to users
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Learning paths are public for reading
CREATE POLICY "Learning paths are public for reading" ON learning_paths FOR SELECT USING (is_published = true);

-- Users can create learning paths
CREATE POLICY "Users can create learning paths" ON learning_paths FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own learning paths
CREATE POLICY "Users can update own learning paths" ON learning_paths FOR UPDATE USING (auth.uid() = author_id);

-- Learning path steps are public for reading
CREATE POLICY "Learning path steps are public for reading" ON learning_path_steps FOR SELECT USING (true);

-- Users can create learning path steps
CREATE POLICY "Users can create learning path steps" ON learning_path_steps FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM learning_paths WHERE id = path_id AND author_id = auth.uid())
);

-- Users can update their own learning path steps
CREATE POLICY "Users can update own learning path steps" ON learning_path_steps FOR UPDATE USING (
    EXISTS (SELECT 1 FROM learning_paths WHERE id = path_id AND author_id = auth.uid())
);

-- User learning progress is private to users
CREATE POLICY "Users can manage own learning progress" ON user_learning_progress FOR ALL USING (auth.uid() = user_id);

-- Users table policies
-- Users are public for reading
CREATE POLICY "Users are public for reading" ON users FOR SELECT USING (true);

-- Users can create their own profile
CREATE POLICY "Users can create own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);