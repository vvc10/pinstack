-- pinstack Sample Data Seeding Script
-- This script inserts sample data for development and testing

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample users
INSERT INTO users (id, email, username, full_name, avatar_url, bio, role, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'johndoe', 'John Doe', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Full-stack developer passionate about React and Node.js', 'user', true),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'janesmith', 'Jane Smith', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'UI/UX Designer and Frontend Developer', 'user', true),
('550e8400-e29b-41d4-a716-446655440003', 'mike.wilson@example.com', 'mikewilson', 'Mike Wilson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Backend developer specializing in Python and Go', 'user', false),
('550e8400-e29b-41d4-a716-446655440004', 'sarah.jones@example.com', 'sarahjones', 'Sarah Jones', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'DevOps Engineer and Cloud Architect', 'user', true),
('550e8400-e29b-41d4-a716-446655440005', 'alex.chen@example.com', 'alexchen', 'Alex Chen', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Mobile app developer and React Native expert', 'user', false);

-- Insert sample boards
INSERT INTO boards (id, name, description, is_public, owner_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'React Components', 'Amazing React components and patterns', true, '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440002', 'CSS Tricks', 'Creative CSS techniques and animations', true, '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440003', 'Python Scripts', 'Useful Python automation scripts', true, '550e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440004', 'DevOps Tools', 'Infrastructure and deployment tools', true, '550e8400-e29b-41d4-a716-446655440004'),
('650e8400-e29b-41d4-a716-446655440005', 'Mobile UI', 'Beautiful mobile app interfaces', true, '550e8400-e29b-41d4-a716-446655440005'),
('650e8400-e29b-41d4-a716-446655440006', 'JavaScript Tips', 'Advanced JavaScript patterns and tricks', true, '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440007', 'Design Systems', 'Component libraries and design tokens', true, '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440008', 'Backend APIs', 'RESTful API designs and best practices', true, '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample pins
INSERT INTO pins (id, title, description, code, language, tags, image_url, author_id, board_id, status, view_count, like_count, save_count) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Custom React Hook for API Calls', 'A reusable hook for handling API requests with loading states and error handling', 'import { useState, useEffect } from ''react'';

const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error(''Failed to fetch'');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApi;', 'javascript', ARRAY['react', 'hooks', 'api'], 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'published', 1250, 89, 45),

('750e8400-e29b-41d4-a716-446655440002', 'CSS Grid Layout System', 'A flexible grid system using CSS Grid for responsive layouts', '.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}', 'css', ARRAY['tailwind', 'minimal', 'layout', 'responsive'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'published', 980, 67, 32),

('750e8400-e29b-41d4-a716-446655440003', 'Python Data Processing Pipeline', 'Efficient data processing using pandas and numpy', 'import pandas as pd
import numpy as np
from typing import List, Dict

def process_data(file_path: str) -> pd.DataFrame:
    """Process CSV data with cleaning and transformation"""
    df = pd.read_csv(file_path)
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Handle missing values
    df = df.fillna(method=''ffill'')
    
    # Convert date columns
    date_columns = df.select_dtypes(include=[''object'']).columns
    for col in date_columns:
        if df[col].str.contains(r''\d{4}-\d{2}-\d{2}'').any():
            df[col] = pd.to_datetime(df[col], errors=''coerce'')
    
    # Add calculated fields
    df[''processed_at''] = pd.Timestamp.now()
    
    return df

def analyze_data(df: pd.DataFrame) -> Dict:
    """Generate basic statistics"""
    return {
        ''total_rows'': len(df),
        ''total_columns'': len(df.columns),
        ''missing_values'': df.isnull().sum().to_dict(),
        ''data_types'': df.dtypes.to_dict()
    }', 'python', ARRAY['dashboard', 'analytics', 'data-processing', 'python'], 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'published', 756, 43, 28),

('750e8400-e29b-41d4-a716-446655440004', 'Docker Multi-Stage Build', 'Optimized Dockerfile for Node.js applications', '# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]', 'dockerfile', ARRAY['navbar', 'security', 'optimization', 'docker'], 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 'published', 892, 56, 41),

('750e8400-e29b-41d4-a716-446655440005', 'React Native Navigation Setup', 'Complete navigation setup with TypeScript', 'import React from ''react'';
import { NavigationContainer } from ''@react-navigation/native'';
import { createStackNavigator } from ''@react-navigation/stack'';
import { createBottomTabNavigator } from ''@react-navigation/bottom-tabs'';
import { Ionicons } from ''@expo/vector-icons'';

// Types
type RootStackParamList = {
  Main: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        
        if (route.name === ''Home'') {
          iconName = focused ? ''home'' : ''home-outline'';
        } else if (route.name === ''Search'') {
          iconName = focused ? ''search'' : ''search-outline'';
        } else if (route.name === ''Favorites'') {
          iconName = focused ? ''heart'' : ''heart-outline'';
        }
        
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: ''#007AFF'',
      tabBarInactiveTintColor: ''gray'',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}', 'typescript', ARRAY['react', 'navbar', 'typescript', 'mobile'], 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', 'published', 634, 38, 22),

('750e8400-e29b-41d4-a716-446655440006', 'Hero Section Component', 'Beautiful hero section with gradient background and call-to-action', '<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
  <div className="absolute inset-0 bg-black/20"></div>
  <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
      Build Amazing Apps
    </h1>
    <p className="text-xl md:text-2xl mb-8 text-blue-100">
      Create stunning user experiences with our modern development tools
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
        Get Started
      </button>
      <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
        Learn More
      </button>
    </div>
  </div>
</section>', 'html', ARRAY['hero', 'landing', 'tailwind', 'minimal'], 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'published', 892, 67, 34);

-- Insert sample pin likes
INSERT INTO pin_likes (pin_id, user_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'), 
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'), 
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'), 
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003'), 
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004');

-- Insert sample pin saves
INSERT INTO pin_saves (pin_id, user_id, board_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003'), 
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003'), 
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003'), 
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'), 
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002'), 
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004');

-- Insert sample comments
INSERT INTO comments (id, content, pin_id, author_id) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Great hook! I''ve been using this pattern in all my React projects.', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('850e8400-e29b-41d4-a716-446655440002', 'This is exactly what I needed for my API calls. Thanks for sharing!', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('850e8400-e29b-41d4-a716-446655440003', 'Love the CSS Grid approach. Much cleaner than flexbox for this use case.', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440004', 'The hover effects are really smooth. Great attention to detail!', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
('850e8400-e29b-41d4-a716-446655440005', 'Excellent data processing pipeline. The type hints make it so much clearer.', '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample hackathons
INSERT INTO hackathons (id, title, description, rules, prizes, start_date, end_date, status, organizer_id) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'AI Innovation Challenge', 'Build innovative AI-powered applications that solve real-world problems. Focus on machine learning, natural language processing, or computer vision.', '1. Teams of 2-4 members\n2. Original code only\n3. 48-hour time limit\n4. Must use provided AI APIs\n5. Demo video required', '1st Place: $10,000\n2nd Place: $5,000\n3rd Place: $2,500\nBest Design: $1,000', '2024-02-01 09:00:00', '2024-02-03 17:00:00', 'upcoming', '550e8400-e29b-41d4-a716-446655440001'),
('950e8400-e29b-41d4-a716-446655440002', 'Sustainable Tech Hackathon', 'Create technology solutions that promote environmental sustainability and combat climate change.', '1. Open to all skill levels\n2. 24-hour event\n3. Must address environmental impact\n4. Working prototype required\n5. Presentation to judges', 'Grand Prize: $15,000\nInnovation Award: $5,000\nImpact Award: $3,000\nAudience Choice: $2,000', '2024-01-15 10:00:00', '2024-01-16 10:00:00', 'active', '550e8400-e29b-41d4-a716-446655440002'),
('950e8400-e29b-41d4-a716-446655440003', 'FinTech Innovation Summit', 'Develop cutting-edge financial technology solutions for the modern economy.', '1. Individual or team entries\n2. 36-hour competition\n3. Must integrate with financial APIs\n4. Security best practices required\n5. Business model presentation', 'Winner: $20,000\nRunner-up: $10,000\nBest UX: $5,000\nMost Innovative: $5,000', '2023-12-10 08:00:00', '2023-12-11 20:00:00', 'ended', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample learning paths
INSERT INTO learning_paths (id, title, description, difficulty, estimated_duration, is_published, author_id) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Complete React Developer', 'Master React from fundamentals to advanced patterns. Build real-world applications and learn best practices.', 'intermediate', 40, true, '550e8400-e29b-41d4-a716-446655440001'),
('a50e8400-e29b-41d4-a716-446655440002', 'Full-Stack JavaScript', 'Learn to build complete web applications using JavaScript, Node.js, and modern frameworks.', 'beginner', 60, true, '550e8400-e29b-41d4-a716-446655440002'),
('a50e8400-e29b-41d4-a716-446655440003', 'Python for Data Science', 'Comprehensive guide to data analysis, machine learning, and visualization with Python.', 'intermediate', 50, true, '550e8400-e29b-41d4-a716-446655440003'),
('a50e8400-e29b-41d4-a716-446655440004', 'DevOps Fundamentals', 'Learn containerization, CI/CD, cloud deployment, and infrastructure as code.', 'advanced', 35, true, '550e8400-e29b-41d4-a716-446655440004'),
('a50e8400-e29b-41d4-a716-446655440005', 'Mobile App Development', 'Build cross-platform mobile applications using React Native and Flutter.', 'intermediate', 45, true, '550e8400-e29b-41d4-a716-446655440005');

-- Insert sample learning path steps
INSERT INTO learning_path_steps (id, path_id, title, description, content, step_order) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'React Fundamentals', 'Learn the basics of React components, props, and state', 'Introduction to React, JSX, components, props, and state management...', 1),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'Hooks and Effects', 'Master React hooks and side effects', 'useState, useEffect, custom hooks, and managing side effects...', 2),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440001', 'State Management', 'Advanced state management with Context and Redux', 'Context API, Redux Toolkit, and global state management...', 3),
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440001', 'Performance Optimization', 'Optimize React applications for better performance', 'Memoization, lazy loading, code splitting, and performance monitoring...', 4),
('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440001', 'Testing React Apps', 'Comprehensive testing strategies for React applications', 'Jest, React Testing Library, and end-to-end testing...', 5);

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'), 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'), 
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'), 
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'), 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'), 
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'), 
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'), 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'), 
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003'), 
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'), 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'), 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'), 
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005'), 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005'), 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005'), 
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data, is_read) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'like', 'New Like', 'janesmith liked your pin "Custom React Hook for API Calls"', '{"pin_id": "750e8400-e29b-41d4-a716-446655440001", "user_id": "550e8400-e29b-41d4-a716-446655440002"}', false),
('550e8400-e29b-41d4-a716-446655440001', 'save', 'Pin Saved', 'mikewilson saved your pin "Custom React Hook for API Calls"', '{"pin_id": "750e8400-e29b-41d4-a716-446655440001", "user_id": "550e8400-e29b-41d4-a716-446655440003"}', false),
('550e8400-e29b-41d4-a716-446655440002', 'comment', 'New Comment', 'johndoe commented on your pin "CSS Grid Layout System"', '{"pin_id": "750e8400-e29b-41d4-a716-446655440002", "comment_id": "850e8400-e29b-41d4-a716-446655440003"}', false),
('550e8400-e29b-41d4-a716-446655440003', 'follow', 'New Follower', 'sarahjones started following you', '{"follower_id": "550e8400-e29b-41d4-a716-446655440004"}', false),
('550e8400-e29b-41d4-a716-446655440004', 'hackathon', 'Hackathon Reminder', 'AI Innovation Challenge starts in 2 days!', '{"hackathon_id": "950e8400-e29b-41d4-a716-446655440001"}', false);

COMMIT;
