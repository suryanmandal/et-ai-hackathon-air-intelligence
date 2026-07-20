import pg from 'pg';
const { Pool } = pg;

// Prevent multiple pools in development due to hot reloading
if (!global.pgPool) {
  global.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL support for production environments (e.g. AWS RDS or Supabase/Aiven)
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
    max: 10, // maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

const pool = global.pgPool;

export default pool;
