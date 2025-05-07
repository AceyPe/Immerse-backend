import { pool } from '../config/db.js';

const db = pool;


export async function createParentTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS parent (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        age INT NOT NULL,
        phone INT NOT NULL,
        userId INT REFERENCES users(id) ON DELETE CASCADE
    );  
    `;
    try {
        await db.query(query);
        console.log('Patient table created or already exists.');
    } catch (error) {
        console.error('Error creating patient table:', error);
    }
}

