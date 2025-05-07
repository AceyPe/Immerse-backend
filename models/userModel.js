import { pool } from '../config/db.js';

const db = pool;


export async function createUserTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);
    `;
    try {
        await db.query(query);
        console.log('User table created or already exists.');
    } catch (error) {
        console.error('Error creating user table:', error);
    }
}