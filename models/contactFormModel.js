import { pool } from '../config/db.js';

const db = pool;


export async function createContactFormTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS contact_form (
        id SERIAL PRIMARY KEY,
        email VARCHAR(50),
        phonenumber VARCHAR(11),
        message VARCHAR(500)
    );  
    `;
    try {
        await db.query(query);
        console.log('Contact Form table created or already exists.');
    } catch (error) {
        console.error('Error creating Contact Form table:', error);
    }
}


