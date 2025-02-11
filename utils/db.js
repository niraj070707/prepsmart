import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http'; // Use the correct import
import * as schema from './schema';

// Initialize the Neon client
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

// Initialize Drizzle ORM with the Neon client and schema
export const db = drizzle(sql, { schema });