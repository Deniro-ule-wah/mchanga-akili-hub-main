import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required in .env');
}

export const pool = new Pool({ connectionString: databaseUrl });

export async function query(text, params) {
  return pool.query(text, params);
}
