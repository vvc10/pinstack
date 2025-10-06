#!/usr/bin/env node

/**
 * Database Migration Runner
 * This script runs the migration to add URL and Figma code columns to the pins table
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...')
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'sql', 'add_url_and_figma_columns.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    }
    
    console.log('✅ Migration completed successfully!')
    console.log('   - Added "url" column to pins table')
    console.log('   - Added "figma_code" column to pins table')
    
  } catch (err) {
    console.error('❌ Migration error:', err)
    process.exit(1)
  }
}

// Alternative method using direct SQL execution
async function runMigrationDirect() {
  try {
    console.log('🚀 Starting database migration (direct method)...')
    
    // Check if columns exist
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'pins')
      .in('column_name', ['url', 'figma_code'])
    
    if (checkError) {
      console.error('❌ Error checking existing columns:', checkError)
      process.exit(1)
    }
    
    const existingColumns = columns.map(col => col.column_name)
    
    // Add url column if it doesn't exist
    if (!existingColumns.includes('url')) {
      console.log('   Adding "url" column...')
      const { error: urlError } = await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE pins ADD COLUMN url TEXT;' 
      })
      
      if (urlError) {
        console.error('❌ Error adding url column:', urlError)
        process.exit(1)
      }
      console.log('   ✅ "url" column added')
    } else {
      console.log('   ℹ️  "url" column already exists')
    }
    
    // Add figma_code column if it doesn't exist
    if (!existingColumns.includes('figma_code')) {
      console.log('   Adding "figma_code" column...')
      const { error: figmaError } = await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE pins ADD COLUMN figma_code TEXT;' 
      })
      
      if (figmaError) {
        console.error('❌ Error adding figma_code column:', figmaError)
        process.exit(1)
      }
      console.log('   ✅ "figma_code" column added')
    } else {
      console.log('   ℹ️  "figma_code" column already exists')
    }
    
    console.log('✅ Migration completed successfully!')
    
  } catch (err) {
    console.error('❌ Migration error:', err)
    process.exit(1)
  }
}

// Run the migration
runMigrationDirect()
