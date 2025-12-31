import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { Pool } from 'pg';
import { config } from 'dotenv';

// load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

const DATASETS = [
  {
    csvFile: 'openpowerlifting.csv',
    table: 'opl.opl_raw'
  },
  {
    csvFile: 'openipf.csv',
    table: 'opl.ipf_raw'
  }
];

const DATA_DIR = path.join(__dirname, '..', 'data', 'downloads');

// find csv file in directory (recursive)
function findCsvFile(dir: string, baseName: string): string {
  const searchDir = (currentDir: string): string | null => {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // check if it's a date-suffixed directory (e.g., openpowerlifting-2025-12-27)
        if (item.startsWith(baseName.split('.')[0]) && /\d{4}-\d{2}-\d{2}/.test(item)) {
          // look directly in this directory
          const subItems = fs.readdirSync(itemPath);
          for (const subItem of subItems) {
            if (subItem.endsWith('.csv')) {
              return path.join(itemPath, subItem);
            }
          }
        }
        // otherwise search recursively
        const found = searchDir(itemPath);
        if (found) return found;
      } else if (item.endsWith('.csv') && item.includes(baseName.split('-')[0])) {
        return itemPath;
      }
    }
    
    return null;
  };
  
  const csvPath = searchDir(dir);
  if (!csvPath) {
    throw new Error(`csv file not found in ${dir} or subdirectories`);
  }
  
  return csvPath;
}

// parse numeric value from csv
function parseNumeric(value: string): number | null {
  if (!value || value === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// parse date value from csv
function parseDate(value: string): string | null {
  if (!value || value === '') return null;
  return value;
}

// import csv data into database
async function importCSV(csvPath: string, tableName: string, pool: Pool): Promise<void> {
  console.log(`importing ${csvPath} into ${tableName}`);
  
  const client = await pool.connect();
  
  try {
    // start transaction
    await client.query('BEGIN');
    
    // truncate table before import
    console.log(`truncating ${tableName}`);
    await client.query(`TRUNCATE ${tableName} RESTART IDENTITY`);
    
    const parser = createReadStream(csvPath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true
      })
    );

    let count = 0;
    let batch: any[] = [];
    const BATCH_SIZE = 1000;

    for await (const record of parser) {
      // map csv columns to database columns
      const row = {
        name: record.Name || null,
        sex: record.Sex || null,
        event: record.Event || null,
        equipment: record.Equipment || null,
        age: parseNumeric(record.Age),
        ageclass: record.AgeClass || null,
        birthyearclass: record.BirthYearClass || null,
        division: record.Division || null,
        bodyweightkg: parseNumeric(record.BodyweightKg),
        weightclasskg: record.WeightClassKg || null,
        squat1kg: parseNumeric(record.Squat1Kg),
        squat2kg: parseNumeric(record.Squat2Kg),
        squat3kg: parseNumeric(record.Squat3Kg),
        squat4kg: parseNumeric(record.Squat4Kg),
        best3squatkg: parseNumeric(record.Best3SquatKg),
        bench1kg: parseNumeric(record.Bench1Kg),
        bench2kg: parseNumeric(record.Bench2Kg),
        bench3kg: parseNumeric(record.Bench3Kg),
        bench4kg: parseNumeric(record.Bench4Kg),
        best3benchkg: parseNumeric(record.Best3BenchKg),
        deadlift1kg: parseNumeric(record.Deadlift1Kg),
        deadlift2kg: parseNumeric(record.Deadlift2Kg),
        deadlift3kg: parseNumeric(record.Deadlift3Kg),
        deadlift4kg: parseNumeric(record.Deadlift4Kg),
        best3deadliftkg: parseNumeric(record.Best3DeadliftKg),
        totalkg: parseNumeric(record.TotalKg),
        place: record.Place || null,
        dots: parseNumeric(record.Dots),
        wilks: parseNumeric(record.Wilks),
        glossbrenner: parseNumeric(record.Glossbrenner),
        goodlift: parseNumeric(record.Goodlift),
        tested: record.Tested || null,
        country: record.Country || null,
        state: record.State || null,
        federation: record.Federation || null,
        parentfederation: record.ParentFederation || null,
        date: parseDate(record.Date),
        meetcountry: record.MeetCountry || null,
        meetstate: record.MeetState || null,
        meettown: record.MeetTown || null,
        meetname: record.MeetName || null,
        sanctioned: record.Sanctioned || null
      };

      batch.push(row);

      if (batch.length >= BATCH_SIZE) {
        await insertBatch(client, tableName, batch);
        count += batch.length;
        console.log(`imported ${count} rows`);
        batch = [];
      }
    }

    // insert remaining rows
    if (batch.length > 0) {
      await insertBatch(client, tableName, batch);
      count += batch.length;
    }

    // commit transaction
    await client.query('COMMIT');
    console.log(`successfully imported ${count} rows into ${tableName}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// insert batch of rows
async function insertBatch(client: any, tableName: string, rows: any[]): Promise<void> {
  if (rows.length === 0) return;

  const columns = Object.keys(rows[0]);
  const values: any[] = [];
  const placeholders: string[] = [];

  rows.forEach((row, rowIndex) => {
    const rowPlaceholders: string[] = [];
    columns.forEach((col, colIndex) => {
      const paramIndex = rowIndex * columns.length + colIndex + 1;
      rowPlaceholders.push(`$${paramIndex}`);
      values.push(row[col]);
    });
    placeholders.push(`(${rowPlaceholders.join(', ')})`);
  });

  const query = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES ${placeholders.join(', ')}
  `;

  await client.query(query, values);
}


// main import function
async function importData() {
  console.log('starting data import...\n');

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

    // process each dataset
    for (const dataset of DATASETS) {
      console.log(`\nprocessing ${dataset.csvFile}`);
      
      // find the actual csv file
      const csvPath = findCsvFile(DATA_DIR, dataset.csvFile);

      // import csv into database
      await importCSV(csvPath, dataset.table, pool);
    }

    console.log('\nimport completed successfully!');
    
  } catch (error) {
    console.error('import failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importData();
