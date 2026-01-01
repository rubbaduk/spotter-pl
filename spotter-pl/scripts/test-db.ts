import { Pool } from 'pg';
import { config } from 'dotenv';
import * as path from 'path';

// load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

async function testDatabase() {
  console.log('testing database connection and queries...\n');

  // import shared database configuration
  const { dbConfig } = await import('../lib/db-config');
  
  // create database pool with shared config
  const pool = new Pool({
    ...dbConfig,
    max: 3
  });

  const client = await pool.connect();
  
  try {
    // test 1: basic connection
    console.log('1. testing basic connection...');
    await client.query('SELECT 1');
    console.log('✓ connection successful\n');

    // test 2: check if schema exists
    console.log('2. checking schema...');
    const schemaResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'opl'
    `);
    if (schemaResult.rows.length > 0) {
      console.log('✓ schema "opl" exists\n');
    } else {
      console.log('✗ schema "opl" not found\n');
      return;
    }

    // test 3: check tables
    console.log('3. checking tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'opl'
      ORDER BY table_name
    `);
    console.log('tables found:', tablesResult.rows.map(r => r.table_name).join(', '));
    console.log();

    // test 4: check row counts
    console.log('4. checking row counts...');
    const countQueries = [
      'SELECT COUNT(*) as count FROM opl.opl_raw',
      'SELECT COUNT(*) as count FROM opl.ipf_raw',
      'SELECT COUNT(*) as count FROM opl.lifter_search'
    ];
    
    for (const query of countQueries) {
      const result = await client.query(query);
      const match = query.match(/FROM (\w+\.\w+)/);
      if (match) {
        const tableName = match[1];
        console.log(`${tableName}: ${result.rows[0].count.toLocaleString()} rows`);
      }
    }
    console.log();

    // test 5: test search query
    console.log('5. testing search query...');
    const searchResult = await client.query(`
      SELECT name, sex, country, meets_count
      FROM opl.lifter_search
      WHERE name ILIKE '%john%'
      LIMIT 5
    `);
    console.log(`found ${searchResult.rows.length} lifters with name containing 'john':`);
    searchResult.rows.forEach(row => {
      console.log(`  - ${row.name} (${row.sex}, ${row.country}, ${row.meets_count} meets)`);
    });
    console.log();

    // test 6: test similarity search (requires pg_trgm)
    console.log('6. testing similarity search...');
    try {
      const similarityResult = await client.query(`
        SELECT name, similarity(name, 'john smith') as score
        FROM opl.lifter_search
        WHERE name % 'john smith'
        ORDER BY score DESC
        LIMIT 5
      `);
      console.log(`found ${similarityResult.rows.length} similar names to 'john smith':`);
      similarityResult.rows.forEach(row => {
        console.log(`  - ${row.name} (score: ${row.score.toFixed(3)})`);
      });
    } catch (error) {
      console.log('✗ similarity search failed (pg_trgm extension may not be installed)');
    }
    console.log();

    // test 7: test raw data query
    console.log('7. testing raw data query...');
    const rawDataResult = await client.query(`
      SELECT name, federation, date, best3squatkg, best3benchkg, best3deadliftkg
      FROM opl.opl_raw
      WHERE name ILIKE '%john%' AND best3squatkg IS NOT NULL
      LIMIT 3
    `);
    console.log(`sample raw data for lifters named 'john':`);
    rawDataResult.rows.forEach(row => {
      console.log(`  - ${row.name}, ${row.federation}, ${row.date}: S=${row.best3squatkg}, B=${row.best3benchkg}, D=${row.best3deadliftkg}`);
    });

    console.log('\n✓ all tests completed successfully!');
    
  } catch (error) {
    console.error('✗ test failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

testDatabase();
