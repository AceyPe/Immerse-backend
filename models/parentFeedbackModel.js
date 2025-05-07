import { pool } from '../config/db.js';

const db = pool;


export async function createParentFeedbackTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS parent_feedback (
        id SERIAL PRIMARY KEY,
        parentId INT REFERENCES parent(id) ON DELETE CASCADE,
        patientId INT REFERENCES patient(id) ON DELETE CASCADE,
        parentName VARCHAR(50),
        patientName VARCHAR(50),
        rating INT NOT NULL,
        behaviourOfChild VARCHAR(500)
    );  
    `;
    try {
        await db.query(query);
        console.log('Fear Analysis table created or already exists.');
    } catch (error) {
        console.error('Error creating Fear Analysis table:', error);
    }
}


