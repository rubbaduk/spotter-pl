import { Pool } from 'pg';
import { config } from 'dotenv';

// load environment variables from .env.local
config({ path: require('path').join(__dirname, '..', '.env.local') });

async function populateLifterSearch() {
  console.log('populating lifter_search table...\n');

  // import shared database configuration
  const { dbConfig } = await import('../lib/db-config');
  
  // create database pool with shared config
  const pool = new Pool({
    ...dbConfig,
    max: 3
  });

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // clear existing data
    console.log('clearing existing lifter_search data...');
    await client.query('TRUNCATE opl.lifter_search RESTART IDENTITY');
    
    // populate with aggregated data from both tables
    console.log('aggregating lifter data from both tables...');
    const query = `
      INSERT INTO opl.lifter_search (
        name, sex, country, earliest_year, latest_year, federations, meets_count
      )
      SELECT
        name,
        min(sex) as sex,
        min(country) as country,
        min(extract(year from date::date))::int as earliest_year,
        max(extract(year from date::date))::int as latest_year,
        array_agg(distinct federation) as federations,
        count(*)::int as meets_count
      FROM (
        SELECT name, sex, country, date, federation
        FROM opl.opl_raw
        WHERE name is not null and name <> ''
        
        UNION ALL
        
        SELECT name, sex, country, date, federation
        FROM opl.ipf_raw
        WHERE name is not null and name <> ''
      ) all_lifters
      GROUP BY name;
    `;
    
    await client.query(query);
    await client.query('COMMIT');
    
    // get count
    const result = await client.query('SELECT COUNT(*) FROM opl.lifter_search');
    console.log(`created ${result.rows[0].count} unique lifter records`);
    
    // show some stats
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_lifters,
        COUNT(CASE WHEN cardinality(federations) > 1 THEN 1 END) as multi_federation_lifters
      FROM opl.lifter_search
    `);
    
    console.log(`total lifters: ${stats.rows[0].total_lifters}`);
    console.log(`lifters in multiple federations: ${stats.rows[0].multi_federation_lifters}`);
    
    console.log('\nlifter_search table populated successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('failed to populate lifter_search:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

populateLifterSearch();
