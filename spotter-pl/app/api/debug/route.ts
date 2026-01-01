import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variables without exposing sensitive values
  const envCheck = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDbUser: !!process.env.DB_USER,
    hasDbPassword: !!process.env.DB_PASSWORD,
    hasDbHost: !!process.env.DB_HOST,
    hasDbPort: !!process.env.DB_PORT,
    hasDbName: !!process.env.DB_NAME,
    hasSslCert: !!process.env.SSL_CERT,
    nodeEnv: process.env.NODE_ENV,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    sslCertLength: process.env.SSL_CERT?.length || 0,
  };

  // Try to test database connection
  let dbTest: { success: boolean; message: string } = { success: false, message: 'Not tested' };
  
  try {
    // Import dynamically to avoid build issues
    const { default: pool } = await import('@/lib/db');
    const result = await pool.query('SELECT 1 as test');
    dbTest = { success: true, message: 'Database connection successful' };
  } catch (error) {
    dbTest = { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }

  return NextResponse.json({
    message: 'Environment and database debug',
    environment: envCheck,
    database: dbTest
  });
}
