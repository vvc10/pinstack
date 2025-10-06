-- Update existing pins with new tags
-- This script updates the tags for existing pins to use the new tag system

-- Update pin 1: Custom React Hook for API Calls
UPDATE pins 
SET tags = ARRAY['react', 'hooks', 'api']
WHERE id = '750e8400-e29b-41d4-a716-446655440001';

-- Update pin 2: CSS Grid Layout
UPDATE pins 
SET tags = ARRAY['tailwind', 'minimal', 'layout', 'responsive']
WHERE id = '750e8400-e29b-41d4-a716-446655440002';

-- Update pin 3: Python Data Processing Pipeline
UPDATE pins 
SET tags = ARRAY['dashboard', 'analytics', 'data-processing', 'python']
WHERE id = '750e8400-e29b-41d4-a716-446655440003';

-- Update pin 4: Docker Multi-Stage Build
UPDATE pins 
SET tags = ARRAY['navbar', 'security', 'optimization', 'docker']
WHERE id = '750e8400-e29b-41d4-a716-446655440004';

-- Update pin 5: React Native Navigation Setup
UPDATE pins 
SET tags = ARRAY['react', 'navbar', 'typescript', 'mobile']
WHERE id = '750e8400-e29b-41d4-a716-446655440005';

-- Add new pins with the remaining tags
INSERT INTO pins (id, title, description, code, language, tags, image_url, author_id, board_id, status, view_count, like_count, save_count) VALUES
('750e8400-e29b-41d4-a716-446655440007', 'Pricing Table Component', 'Clean pricing table with feature comparison', '<div className="max-w-6xl mx-auto px-4 py-16">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
    <p className="text-xl text-gray-600">Select the perfect plan for your needs</p>
  </div>
  
  <div className="grid md:grid-cols-4 gap-8">
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-2xl font-bold mb-4">Starter</h3>
      <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-500">/month</span></div>
      <ul className="space-y-3 mb-8">
        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 5 Projects</li>
        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 10GB Storage</li>
        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Email Support</li>
      </ul>
      <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
        Get Started
      </button>
    </div>
    
    <div className="bg-blue-600 rounded-2xl shadow-xl p-8 text-white relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">Popular</span>
      </div>
      <h3 className="text-2xl font-bold mb-4">Pro</h3>
      <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-blue-200">/month</span></div>
      <ul className="space-y-3 mb-8">
        <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 25 Projects</li>
        <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 100GB Storage</li>
        <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Priority Support</li>
      </ul>
      <button className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
        Get Started
      </button>
    </div>
    
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
      <div className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-500">/month</span></div>
      <ul className="space-y-3 mb-8">
        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited Projects</li>
        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 1TB Storage</li>
        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 24/7 Support</li>
      </ul>
      <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
        Get Started
      </button>
    </div>
  </div>
</div>', 'html', ARRAY['pricing', 'landing', 'tailwind', 'minimal'], 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'published', 756, 52, 28),

('750e8400-e29b-41d4-a716-446655440008', 'FAQ Accordion Component', 'Interactive FAQ section with smooth animations', '<div className="max-w-3xl mx-auto px-4 py-16">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
    <p className="text-xl text-gray-600">Find answers to common questions</p>
  </div>
  
  <div className="space-y-4">
    <details className="group bg-white rounded-lg shadow-sm border border-gray-200">
      <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900">What is your refund policy?</span>
        <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="px-6 pb-6 text-gray-600">
        <p>We offer a 30-day money-back guarantee for all our plans. If you''re not satisfied, contact our support team for a full refund.</p>
      </div>
    </details>
    
    <details className="group bg-white rounded-lg shadow-sm border border-gray-200">
      <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900">How do I cancel my subscription?</span>
        <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="px-6 pb-6 text-gray-600">
        <p>You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.</p>
      </div>
    </details>
    
    <details className="group bg-white rounded-lg shadow-sm border border-gray-200">
      <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900">Do you offer team discounts?</span>
        <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="px-6 pb-6 text-gray-600">
        <p>Yes! We offer special pricing for teams of 5 or more users. Contact our sales team for custom pricing options.</p>
      </div>
    </details>
  </div>
</div>', 'html', ARRAY['faq', 'landing', 'tailwind', 'minimal'], 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'published', 634, 41, 22),

('750e8400-e29b-41d4-a716-446655440009', 'Dark Mode Toggle', 'Smooth dark mode implementation with system preference detection', 'import { useState, useEffect } from ''react'';
import { Sun, Moon } from ''lucide-react'';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia(''(prefers-color-scheme: dark)'').matches;
    const savedTheme = localStorage.getItem(''theme'');
    
    if (savedTheme === ''dark'' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add(''dark'');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add(''dark'');
      localStorage.setItem(''theme'', ''dark'');
    } else {
      document.documentElement.classList.remove(''dark'');
      localStorage.setItem(''theme'', ''light'');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

// CSS for dark mode support
const darkModeStyles = `
.dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
}

.light {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #666666;
}
`;', 'javascript', ARRAY['dark-mode', 'react', 'tailwind', 'minimal'], 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 'published', 1123, 89, 45),

('750e8400-e29b-41d4-a716-446655440010', 'Footer Component', 'Modern footer with links and social media', '<footer className="bg-gray-900 text-white">
  <div className="max-w-6xl mx-auto px-4 py-16">
    <div className="grid md:grid-cols-4 gap-8">
      <div className="col-span-2">
        <h3 className="text-2xl font-bold mb-4">Your Company</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Building amazing products that help developers create better experiences.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-4">Product</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold mb-4">Company</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>
    </div>
    
    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</footer>', 'html', ARRAY['footer', 'landing', 'tailwind', 'minimal'], 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', 'published', 445, 32, 18);

-- Add some likes for the new pins
INSERT INTO pin_likes (pin_id, user_id) VALUES
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003'),
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001');
