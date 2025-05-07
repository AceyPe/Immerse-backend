import pg from 'pg'
import dotenv from 'dotenv'

const { Pool, Client } = pg
dotenv.config();

export const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
}
)

// Test connection
const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await pool.query('SELECT NOW()');
            console.log("Connected to PostgreSQL! ✅", result.rows[0]);
            return;
        } catch (error) {
            console.error(`PostgreSQL connection failed. Retrying in ${delay / 1000} seconds...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    console.error("PostgreSQL connection failed after multiple attempts. ❌");
    process.exit(1);
};

// Try connecting
connectWithRetry();
