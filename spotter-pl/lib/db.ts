import { Pool } from 'pg';
import { dbConfig } from './db-config';

const pool = new Pool({
  ...dbConfig,
  max: 3, //pool
});

export default pool;