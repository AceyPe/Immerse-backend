import { pool } from '../config/db.js';
import validator from 'validator'

const db = pool;

function sanitizeInput(input) {

    return validator.escape(input);
}

export const formSubmit = async (req, res) => {
    const { data, type } = req.body;
    const parentQuery = `
    INSERT INTO parent_feedback (parentId, patientId, parentName, patientName, rating, behaviourOfChild)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;
    
    const patientQuery = `
    INSERT INTO fear_analysis_feedback (patientId, sessionId, patientName, rating, ratingReason, feeling, stressLevel, struggle, sessionFeedback)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `;
    
    try {
        if (type === "parent") {
            const { parentId, patientId, parentName, patientName, rating, behaviourOfChild } = data;
            const sanitizedParentName = sanitizeInput(parentName);
            const sanitizedPatientName = sanitizeInput(patientName);
            const sanitizeBehaviourOfChild = sanitizeInput(behaviourOfChild);
            await db.query(parentQuery, [parentId, patientId, sanitizedParentName, sanitizedPatientName, rating, sanitizeBehaviourOfChild]);
            res.status(201).json({ message: "Form Submited Successfully!" });
        }

        else if (type === "patient") {
            const { patientId, sessionId, patientName, rating, ratingReason, feeling, stressLevel, struggle, sessionFeedback } = data;
            const sanitizeRatingReason = sanitizeInput(ratingReason);
            const sanitizeSessionFeedBack = sanitizeInput(sessionFeedback);
            await db.query(patientQuery, [patientId, sessionId, patientName, rating, sanitizeRatingReason, feeling, stressLevel, struggle, sanitizeSessionFeedBack]);
            res.status(201).json({ message: "Form Submited Successfully!" });
        }
    } catch (error) {
        console.error('Error inserting Form:', error);
        throw error;
    }
}

export const getForms = async (req, res) => {
    try {
      const fearQuery = `SELECT * FROM fear_analysis_feedback;`;
      const parentQuery = `SELECT * FROM parent_feedback;`;
    const [fearResult, parentResult] = await Promise.all([
        db.query(fearQuery),
        db.query(parentQuery),
    ]);
        return res.status(200).json({
            fearForms: fearResult.rows,
            parentForms: parentResult.rows,
    });
    } catch (err) {
        console.error("Error fetching forms:", err);
        return res.status(500).json({
            message: 'Error fetching forms, please try again later.',
            error: err.message
        });
    }
};

export const getFearFormById = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM fear_analysis_feedback WHERE id = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Form response not found' });
        }

        const formData = rows[0];
        return res.status(200).json({ form: formData });
    } catch (err) {
        console.error('Error fetching form response:', err);
        return res.status(500).json({
            message: 'Error fetching form response, please try again later.',
            error: err.message
        });
    }
};

export const getParentFormById = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM parent_feedback WHERE id = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Form response not found' });
        }

        const formData = rows[0];
        return res.status(200).json({ form: formData });
    } catch (err) {
        console.error('Error fetching form response:', err);
        return res.status(500).json({
            message: 'Error fetching form response, please try again later.',
            error: err.message
        });
    }
};

export const getFearFormsByTherapistId = async (req, res) => {
    const { id } = req.params;
    const query = `
                    SELECT f.*
                    FROM fear_analysis_feedback f
                    JOIN patient p ON f.patientId = p.id
                    WHERE p.therapistId = $1;
                `;
    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Form response not found' });
        }

        const { password, ...userData } = rows[0];
        return res.status(200).json({ forms: userData });
    } catch (err) {
        console.error('Error fetching form response:', err);
        return res.status(500).json({
            message: 'Error fetching form response, please try again later.',
            error: err.message
        });
    }
};

export const getParentFormsByTherapistId = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT f.*
                    FROM parent_feedback f
                    JOIN patient p ON f.patientId = p.id
                    WHERE therapistId = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Form response not found' });
        }

        const { password, ...userData } = rows[0];
        return res.status(200).json({ forms: userData });
    } catch (err) {
        console.error('Error fetching form response:', err);
        return res.status(500).json({
            message: 'Error fetching form response, please try again later.',
            error: err.message
        });
    }
};
