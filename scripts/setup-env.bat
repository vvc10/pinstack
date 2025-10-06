@echo off
REM pinstack Environment Setup Script for Windows
REM This script helps you set up your environment configuration

echo 🚀 pinstack Environment Setup
echo ==========================

REM Check if .env.local already exists
if exist ".env.local" (
    echo ⚠️  .env.local already exists!
    set /p overwrite="Do you want to overwrite it? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo ❌ Setup cancelled.
        exit /b 1
    )
)

REM Copy template to .env.local
echo 📋 Copying environment template...
copy env.local.template .env.local >nul

echo ✅ .env.local created successfully!
echo.
echo 🔧 Next steps:
echo 1. Open .env.local in your editor
echo 2. Update the following required values:
echo    - NEXT_PUBLIC_SUPABASE_URL
echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_ROLE_KEY
echo    - NEXTAUTH_SECRET
echo.
echo 📖 Get your Supabase credentials from:
echo    https://supabase.com/dashboard → Your Project → Settings → API
echo.
echo 🔐 Generate NEXTAUTH_SECRET with:
echo    openssl rand -base64 32
echo    OR use an online generator
echo.
echo 🎉 Once configured, run 'pnpm dev' to start the development server!

pause
