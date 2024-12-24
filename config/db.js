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

// console.log(pool)
// console.log(await pool.query('SELECT user FROM USER'))

const client = new Client({
    user: pool.user,
    password: pool.password,
    host: pool.host,
    port: pool.port || 5432,
    database: pool.database,
})

await client.connect()

// console.log(await client.query('SELECT NOW()'))

await client.end()