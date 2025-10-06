#!/usr/bin/env node

/**
 * Environment Validation Script
 * Checks if all required environment variables are properly configured
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NEXTAUTH_URL'
];

// Optional environment variables
const OPTIONAL_VARS = [
  'NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'NEXT_PUBLIC_GA_ID',
  'SENTRY_DSN'
];

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.log('💡 Run the setup script: ./scripts/setup-env.sh');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return envVars;
}

function validateUrl(url, name) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    console.error(`❌ Invalid ${name}: ${url}`);
    return false;
  }
}

function validateSupabaseUrl(url) {
  if (!url.includes('supabase.co')) {
    console.error(`❌ Invalid Supabase URL: ${url}`);
    console.log('💡 Supabase URLs should end with .supabase.co');
    return false;
  }
  return true;
}

function validateSecret(secret, name) {
  if (secret.length < 32) {
    console.error(`❌ ${name} is too short (minimum 32 characters)`);
    return false;
  }
  return true;
}

function main() {
  console.log('🔍 Validating environment configuration...\n');

  const envVars = loadEnvFile();
  let hasErrors = false;

  // Check required variables
  console.log('📋 Checking required variables:');
  REQUIRED_VARS.forEach(varName => {
    const value = envVars[varName];
    
    if (!value) {
      console.error(`❌ Missing: ${varName}`);
      hasErrors = true;
    } else if (value.includes('your-') || value.includes('placeholder')) {
      console.error(`❌ Not configured: ${varName} (still contains placeholder)`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName}`);
    }
  });

  // Validate specific variables
  console.log('\n🔧 Validating specific variables:');
  
  if (envVars.NEXT_PUBLIC_SUPABASE_URL) {
    if (!validateSupabaseUrl(envVars.NEXT_PUBLIC_SUPABASE_URL)) {
      hasErrors = true;
    }
  }

  if (envVars.NEXT_PUBLIC_APP_URL) {
    if (!validateUrl(envVars.NEXT_PUBLIC_APP_URL, 'App URL')) {
      hasErrors = true;
    }
  }

  if (envVars.NEXTAUTH_URL) {
    if (!validateUrl(envVars.NEXTAUTH_URL, 'NextAuth URL')) {
      hasErrors = true;
    }
  }

  if (envVars.NEXTAUTH_SECRET) {
    if (!validateSecret(envVars.NEXTAUTH_SECRET, 'NextAuth Secret')) {
      hasErrors = true;
    }
  }

  // Check optional variables
  console.log('\n📋 Checking optional variables:');
  OPTIONAL_VARS.forEach(varName => {
    const value = envVars[varName];
    if (value && !value.includes('your-') && !value.includes('placeholder')) {
      console.log(`✅ ${varName}`);
    } else if (value && (value.includes('your-') || value.includes('placeholder'))) {
      console.log(`⚠️  Not configured: ${varName} (optional)`);
    } else {
      console.log(`⚪ Not set: ${varName} (optional)`);
    }
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ Environment validation failed!');
    console.log('\n💡 Next steps:');
    console.log('1. Update the missing or invalid variables in .env.local');
    console.log('2. Get your Supabase credentials from: https://supabase.com/dashboard');
    console.log('3. Generate a NextAuth secret with: openssl rand -base64 32');
    console.log('4. Run this script again to validate');
    process.exit(1);
  } else {
    console.log('✅ Environment validation passed!');
    console.log('\n🎉 Your environment is properly configured!');
    console.log('\n💡 Next steps:');
    console.log('1. Set up your database: Run the SQL schema in Supabase');
    console.log('2. Start the development server: pnpm dev');
    console.log('3. Test the application functionality');
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadEnvFile, validateUrl, validateSupabaseUrl, validateSecret };
