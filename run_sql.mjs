import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://postgres:thenicebott21%40gmail.comG@db.cvviwstlmtrjemddmiup.supabase.co:5432/postgres';

const sql = postgres(connectionString, { ssl: 'require' });

async function run() {
  try {
    const schemaSql = fs.readFileSync(path.resolve('./supabase/schema.sql'), 'utf8');
    
    // Split by semicolons isn't strictly necessary with postgres.js file execution, 
    // but we can just use the query interface.
    await sql.unsafe(schemaSql);
    
    console.log("Migration executed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await sql.end();
  }
}

run();
