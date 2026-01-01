import { config } from 'dotenv';
import * as path from 'path';

// load environment variables from .env.local for local development
if (process.env.NODE_ENV !== 'production') {
  config({ path: path.join(__dirname, '..', '.env.local') });
}

// Parse DATABASE_URL to extract connection details
const parseDatabaseUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return {
      user: urlObj.username,
      password: urlObj.password,
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 5432,
      database: urlObj.pathname.substring(1),
      ssl: urlObj.searchParams.get('sslmode') === 'require' ? { rejectUnauthorized: true } : false
    };
  } catch (error) {
    console.error('Invalid DATABASE_URL format');
    return null;
  }
};

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

// For production, DATABASE_URL is required
if (!databaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL environment variable is required in production');
}

// For local development, use fallback if no .env.local
const fallbackConfig = {
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_NAME ,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SSL_CERT 
  }
};

// export database configuration
export const dbConfig = databaseUrl ? parseDatabaseUrl(databaseUrl) || fallbackConfig : fallbackConfig;
