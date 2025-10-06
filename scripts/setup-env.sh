#!/bin/bash

# pinstack Environment Setup Script
# This script helps you set up your environment configuration

echo "🚀 pinstack Environment Setup"
echo "=========================="

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Copy template to .env.local
echo "📋 Copying environment template..."
cp env.local.template .env.local

echo "✅ .env.local created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Open .env.local in your editor"
echo "2. Update the following required values:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - NEXTAUTH_SECRET"
echo ""
echo "📖 Get your Supabase credentials from:"
echo "   https://supabase.com/dashboard → Your Project → Settings → API"
echo ""
echo "🔐 Generate NEXTAUTH_SECRET with:"
echo "   openssl rand -base64 32"
echo ""
echo "🎉 Once configured, run 'pnpm dev' to start the development server!"

# Make the script executable
chmod +x scripts/setup-env.sh
