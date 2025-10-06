#!/usr/bin/env node

/**
 * Environment Setup Script
 * Creates .env.local from template
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🚀 pinstack Environment Setup');
  console.log('==========================\n');

  const envPath = path.join(process.cwd(), '.env.local');
  const templatePath = path.join(process.cwd(), 'env.local.template');

  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local already exists! Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Setup cancelled.');
      rl.close();
      return;
    }
  }

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error('❌ env.local.template not found!');
    console.log('💡 Make sure you\'re running this from the project root directory.');
    rl.close();
    return;
  }

  try {
    // Copy template to .env.local
    console.log('📋 Copying environment template...');
    fs.copyFileSync(templatePath, envPath);
    
    console.log('✅ .env.local created successfully!\n');
    
    console.log('🔧 Next steps:');
    console.log('1. Open .env.local in your editor');
    console.log('2. Update the following required values:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY');
    console.log('   - NEXTAUTH_SECRET');
    console.log('');
    console.log('📖 Get your Supabase credentials from:');
    console.log('   https://supabase.com/dashboard → Your Project → Settings → API');
    console.log('');
    console.log('🔐 Generate NEXTAUTH_SECRET with:');
    console.log('   openssl rand -base64 32');
    console.log('   OR use: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
    console.log('');
    console.log('🎉 Once configured, run "pnpm dev" to start the development server!');
    console.log('💡 Run "pnpm validate:env" to check your configuration.');

  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
  }

  rl.close();
}

if (require.main === module) {
  main().catch(console.error);
}
