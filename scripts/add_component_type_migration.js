#!/usr/bin/env node

/**
 * Database Migration Runner
 * This script runs the migration to add component_type column to the pins table
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
try {
  require('dotenv').config()
} catch (e) {
  // dotenv not available, use process.env directly
}

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
    console.log('🚀 Starting component_type column migration...')
    
    // Check if component_type column exists
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'pins')
      .eq('column_name', 'component_type')
    
    if (checkError) {
      console.error('❌ Error checking existing columns:', checkError)
      process.exit(1)
    }
    
    if (columns && columns.length > 0) {
      console.log('   ℹ️  "component_type" column already exists')
      return
    }
    
    // Add component_type column
    console.log('   Adding "component_type" column...')
    const { error: addError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE pins ADD COLUMN component_type VARCHAR(50);' 
    })
    
    if (addError) {
      console.error('❌ Error adding component_type column:', addError)
      process.exit(1)
    }
    console.log('   ✅ "component_type" column added')
    
    // Update existing pins to extract component type from tags
    console.log('   Updating existing pins...')
    const { error: updateError } = await supabase.rpc('exec_sql', { 
      sql: `
        UPDATE pins 
        SET component_type = (
          CASE 
            WHEN array_length(tags, 1) > 0 THEN tags[1]
            ELSE NULL
          END
        )
        WHERE component_type IS NULL;
      ` 
    })
    
    if (updateError) {
      console.error('❌ Error updating existing pins:', updateError)
      process.exit(1)
    }
    console.log('   ✅ Existing pins updated')
    
    // Create index for better performance
    console.log('   Creating index...')
    const { error: indexError } = await supabase.rpc('exec_sql', { 
      sql: 'CREATE INDEX IF NOT EXISTS idx_pins_component_type ON pins(component_type);' 
    })
    
    if (indexError) {
      console.error('❌ Error creating index:', indexError)
      process.exit(1)
    }
    console.log('   ✅ Index created')
    
    console.log('✅ Migration completed successfully!')
    console.log('   - Added "component_type" column to pins table')
    console.log('   - Updated existing pins with component types from tags')
    console.log('   - Created index for better performance')
    
  } catch (err) {
    console.error('❌ Migration error:', err)
    process.exit(1)
  }
}

// Run the migration
runMigration()
