import { pool } from '../config/db.js';

const db = pool;


export async function createFearAnalysisTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS fear_analysis_feedback (
        id SERIAL PRIMARY KEY,
        patientId INT REFERENCES patient(id) ON DELETE CASCADE,
        sessionId INT REFERENCES session(id) ON DELETE CASCADE,
        patientName VARCHAR(50),
        rating INT NOT NULL,
        ratingReason VARCHAR(255),
        feeling VARCHAR(50) NOT NULL,
        stressLevel VARCHAR(50) NOT NULL,
        struggle VARCHAR(50) NOT NULL,
        sessionFeedback VARCHAR(50) NOT NULL
    );  
    `;
    try {
        await db.query(query);
        console.log('Fear Analysis table created or already exists.');
    } catch (error) {
        console.error('Error creating Fear Analysis table:', error);
    }
}


