import { createUserTable } from '../models/userModel.js';
import { createTherapistTable } from '../models/therapistModel.js';
import { createParentTable } from '../models/parentModel.js';
import { createPatientTable } from '../models/patientModel.js';
import { createSessionTable } from '../models/sessionModel.js';
import { createParentFeedbackTable } from '../models/parentFeedbackModel.js';
import { createFearAnalysisTable } from '../models/fearAnalysisFeedbackModel.js';
import { createCertificationTable } from '../models/certificationModel.js'
import { pool } from '../config/db.js';
import argon2, { argon2id } from 'argon2';
import { createContactFormTable } from '../models/contactFormModel.js';

 
const db = pool;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function createUserIfNotExists(email, role) {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length === 0) {
        const insertQuery = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await db.query(insertQuery, [email, hashedPassword, role]);
        return result.rows[0]; // return created user
    } else {
        return existing.rows[0]; // return existing user
    }
}

export async function createTables() {
    try {
        await createUserTable();
        await delay(100);

        await createTherapistTable();
        await delay(100);

        await createParentTable();
        await delay(100);

        await createPatientTable();
        await delay(100);

        await createSessionTable();
        await delay(100);

        await createParentFeedbackTable();
        await delay(100);

        await createFearAnalysisTable();
        await delay(100);

        await createCertificationTable();
        await delay(100);

        await createContactFormTable();
        await delay(100);

        const password = "123";
        const hashedPassword = await argon2.hash(password);


        const user1 = await createUserIfNotExists('patient@patient.patient', 'patient');
        const user2 = await createUserIfNotExists('parent@parent.parent', 'parent');
        const user3 = await createUserIfNotExists('therapist@therapist.therapist', 'therapist');
        const user4 = await createUserIfNotExists('therapist2@therapist.therapist', 'therapist');
        const user5 = await createUserIfNotExists('patient2@patient.patient', 'patient');

        // Insert therapist data only if not exists (based on userId)
        const therapist = await db.query('SELECT * FROM therapist WHERE userId = $1', [user3.id]);
        if (therapist.rows.length === 0) {
            await db.query(`
                INSERT INTO therapist (name, age, phone, userId, specialization)
                VALUES ('therapist', 40, '01234567890', $1, 'test')
            `, [user3.id]);
        }

        const therapist2 = await db.query('SELECT * FROM therapist WHERE userId = $1', [user4.id]);
        if (therapist2.rows.length === 0) {
            await db.query(`
                INSERT INTO therapist (name, age, phone, userId, specialization, certified, verified)
                VALUES ('therapist2', 40, '01234567890', $1, 'test', true, true)
            `, [user4.id]);
        }

        const patient1 = await db.query('SELECT * FROM patient WHERE userId = $1', [user1.id]);
        if (patient1.rows.length === 0) {
            await db.query(`
                INSERT INTO patient (therapistId, parentId, name, age, phone, userId)
                VALUES (1, null, 'patient', 20, '01234567890', $1)
            `, [user1.id]);
        }

        const patient2 = await db.query('SELECT * FROM patient WHERE userId = $1', [user5.id]);
        if (patient2.rows.length === 0) {
            await db.query(`
                INSERT INTO patient (therapistId, parentId, name, age, phone, userId)
                VALUES (2, null, 'patient', 23, '01234567890', $1)
            `, [user5.id]);
        }

        const parent = await db.query('SELECT * FROM parent WHERE userId = $1', [user2.id]);
        if (parent.rows.length === 0) {
            await db.query(`
                INSERT INTO parent (name, age, phone, userId)
                VALUES ('parent', 35, '01234567890', $1)
            `, [user2.id]);
        }
        
        console.log("All tables created successfully!");
    } catch (error) {
        console.log("Error creating tables:", error);
    }
}
