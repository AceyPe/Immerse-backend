import { pool } from '../config/db.js';

const db = pool


export async function createSessionTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS session (
        id SERIAL PRIMARY KEY,
        patientId INT REFERENCES patient(id) ON DELETE CASCADE,
        therapistId INT REFERENCES therapist(id) ON DELETE CASCADE,
        MAX_HEART_RATE INT NOT NULL,
        MIN_HEART_RATE INT NOT NULL,
        AVG_HEART_RATE INT NOT NULL
    );
    `;
    try {
        await db.query(query);
        console.log('Session table created or already exists.');
    } catch (error) {
        console.error('Error creating Session table:', error);
    }
}


