import { pool } from '../config/db.js';

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


export const getSessionsDataByTherapistId = async (req, res) => {
    const { id } = req.params;
    console.log("sessions:",typeof(id));
    
    const query = `SELECT * FROM session WHERE therapistId = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No sessions saved yet!" });
        }
        return res.status(200).json({ sessions: rows });
    } catch (err) {
        console.error('Error fetching sessions:', err);
        return res.status(500).json({
            message: 'Error fetching sessions, please try again later.'
        });
    } 
}

export const getSessionsDataByPatientId = async (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM session WHERE patientId = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No sessions for this user!" });
        }
        return res.status(200).json({ sessions: rows[0] });
    } catch (err) {
        console.error('Error fetching sessions:', err);
        return res.status(500).json({ message: 'Error fetching sessions, please try again later.' });
    }
}


export const activeSessions = new Map(); // therapistId -> sessionId

export const startSession = async (req, res) => {
    const { therapistId } = req.params;
    const { sessionId } = req.body;

    if (!therapistId || !sessionId) {
        return res.status(400).json({ error: "Missing therapistId or sessionId" });
    }

    activeSessions.set(therapistId, sessionId);
    console.log(`Started session ${sessionId} for therapist ${therapistId}`);

    res.status(201).json({ message: "Session started", sessionId });
};

export const endSession = async (req, res) => {
    const { therapistId } = req.params;

    if (!activeSessions.has(therapistId)) {
        return res.status(404).json({ error: "No active session for this therapist" });
    }

    activeSessions.delete(therapistId);
    console.log(`Ended session for therapist ${therapistId}`);

    res.status(200).json({ message: "Session ended" });
};

export const getSessions = async (req, res) => {
    const query = `SELECT * FROM session;`;

    try {
        const { rows } = await db.query(query);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No sessions were found!' });
        }

        
        return res.status(200).json({ sessions: rows });
    } catch (err) {
        console.error("Error fetching sessions:", err);
        return res.status(500).json({
            message: 'Error fetching sessions, please try again later.',
            error: err.message
        });
    }
}
