import pkg from 'pg'; // Import the default export
const { Pool } = pkg; // Destructure Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
  idleTimeoutMillis: 300,
});

export default pool; // Default export the pool
