-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, avatar_url, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    'user',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = COALESCE(EXCLUDED.username, users.username),
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.boards TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.pins TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.pin_likes TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.pin_saves TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.comments TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.hackathons TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.hackathon_submissions TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.hackathon_votes TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.follows TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.notifications TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.learning_paths TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.learning_path_steps TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_learning_progress TO postgres, anon, authenticated, service_role;
