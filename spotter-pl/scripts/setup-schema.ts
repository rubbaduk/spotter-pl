import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

async function setupSchema() {
  console.log('setting up database schema...\n');
  
  // import shared database configuration
  const { dbConfig } = await import('../lib/db-config');
  
  // create database pool with shared config
  const pool = new Pool({
    ...dbConfig,
    max: 3
  });

  try {
    // test database connection
    console.log('testing database connection');
    await pool.query('SELECT 1');
    console.log('database connection successful\n');

    // run schema setup
    console.log('creating schema and tables...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await pool.query(schemaSql);
    console.log('schema setup complete\n');
    
  } catch (error) {
    console.error('schema setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupSchema();
