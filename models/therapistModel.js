import { pool } from '../config/db.js';

const db = pool;


export async function createTherapistTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS therapist (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        age INT NOT NULL,
        phone INT NOT NULL,
        specialization VARCHAR(50) NOT NULL,
        certified BOOLEAN NOT NULL DEFAULT false,
        verified BOOLEAN NOT NULL DEFAULT false,
        userId INT REFERENCES users(id) ON DELETE CASCADE
    );
    `;
    try {
        await db.query(query);
        console.log('Therapist table created or already exists.');
    } catch (error) {
        console.error('Error creating therapist table:', error);
    }
}


