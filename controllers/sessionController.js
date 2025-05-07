import { pool } from '../config/db.js';
import { assignBufferedDataToSession } from './sensorsController.js';

const db = pool;

// Create session (called by Unity)
export const createNewSession = async (req, res) => {
    try {
        const { therapistId, patientId } = req.body;

        if (!therapistId || !patientId) {
            return res.status(400).json({ error: "Missing therapistId or patientId" });
        }

        const result = await db.query(`
            INSERT INTO session (therapistId, patientId, MAX_HEART_RATE, MIN_HEART_RATE, AVG_HEART_RATE)
            VALUES ($1, $2, 0, 0, 0)
            RETURNING *;
        `, [therapistId, patientId]);

        const session = result.rows[0];

        // Optionally assign existing sensor data from therapist to this session
        assignBufferedDataToSession(therapistId, session.id);

        res.status(201).json({ message: "Session created", session });

    } catch (error) {
        console.error("Session creation error:", error);
        res.status(500).json({ error: "Could not create session" });
    }
};


export const getSessionDataBySessionId = async (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM session WHERE id = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }

        return res.status(200).json({ sessionData: rows[0] });
    } catch (err) {
        console.error('Error fetching session:', err);
        return res.status(500).json({
            message: 'Error fetching session, please try again later.',
            error: err.message
        });
    }
}


export const getSessionDataByTherapistId = async (req, res) => {
    const { id } = req.params;
    
    const query = `SELECT * FROM session WHERE therapistId = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No sessions saved yet!" });
        }
    } catch (err) {
        console.error('Error fetching sessions:', err);
        return res.status(500).json({
            message: 'Error fetching sessions, please try again later.'
        });
    }

    
}