import { Client } from 'pg';
import { dbConfig } from './lib/db-config';

const client = new Client(dbConfig);

async function testConnection() {
  try {
    await client.connect();
    console.log('connected to database');
    
    const result = await client.query('SELECT VERSION()');
    console.log('database version:', result.rows[0].version);
    
    await client.end();
    console.log('connection closed');
  } catch (error) {
    console.error('connection failed:', error);
    process.exit(1);
  }
}

testConnection();
