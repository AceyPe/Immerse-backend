import { pool } from '../config/db.js';

const db = pool;


export async function createCertificationTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS certification (
        id SERIAL PRIMARY KEY,
        therapistId INT REFERENCES therapist(id) ON DELETE CASCADE,
        title VARCHAR(50)
    );  
    `;
    try {
        await db.query(query);
        console.log('certification table created or already exists.');
    } catch (error) {
        console.error('Error creating certification table:', error);
    }
}


