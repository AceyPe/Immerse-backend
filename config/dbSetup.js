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

 
const db = pool;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

        const password = "123";
        const hashedPassword = await argon2.hash(password);


        const patient = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING *;
            `;
        
        await db.query(patient, ['patient@patient.patient', hashedPassword, 'patient']);
        
        const parent = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING *;
            `;
        
        await db.query(parent, ['parent@parent.parent',hashedPassword, 'parent']);
        
        const therapist = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING *;
            `;
        
        await db.query(therapist, ['therapist@therapist.therapist',hashedPassword, 'therapist']);

        const therapist2 = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING *;
            `;
        
        await db.query(therapist2, ['therapist2@therapist.therapist', hashedPassword, 'therapist']);

         const patient2 = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING *;
            `;
        
        await db.query(patient2, ['patient2@patient.patient', hashedPassword, 'patient']);

        const therapistQuery = `
            INSERT INTO therapist (name, age, phone, userId, specialization)
            VALUES ('therapist', 40, 01234567890, 3, 'test')
            RETURNING *;
            `;
        
        await db.query(therapistQuery);

        const therapist2Query = `
            INSERT INTO therapist (name, age, phone, userId, specialization, certified, verified)
            VALUES ('therapist2', 40, 01234567890, 4, 'test', true, true)
            RETURNING *;
            `;
        
        await db.query(therapist2Query);

        const patientQuery = `
            INSERT INTO patient (therapistId, parentId, name, age, phone, userId)
            VALUES (1, null, 'patient', 20, 01234567890, 1)
            RETURNING *;
            `;
        
        await db.query(patientQuery);

        const patientQuery2 = `
            INSERT INTO patient (therapistId, parentId, name, age, phone, userId)
            VALUES (2, null, 'patient', 23, 01234567890, 5)
            RETURNING *;
            `;
        
        await db.query(patientQuery2)
        
         const parentQuery = `
            INSERT INTO parent (name, age, phone, userId)
            VALUES ('parent', 35, 01234567890, 2)
            RETURNING *;
            `;
        
        await db.query(parentQuery);

        
        console.log("All tables created successfully!");
    } catch (error) {
        console.log("Error creating tables:", error);
    }
}
