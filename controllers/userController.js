import { pool } from '../config/db.js';

const db = pool;

// Get a User by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM users WHERE id = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userData } = rows[0];
        return res.status(200).json({ user: userData });
    } catch (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({
            message: 'Error fetching user, please try again later.',
            error: err.message
        });
    }
};


export const getUsers = async (req, res) => {
    const query = `SELECT * FROM users;`;

    try {
        const { rows } = await db.query(query);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No users were found!' });
        }

        
        return res.status(200).json({ users: rows });
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({
            message: 'Error fetching users, please try again later.',
            error: err.message
        });
    }
}

export const getTherapists = async (req, res) => {
    const query = `SELECT * FROM therapist;`;

    try {
        const { rows } = await db.query(query);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No therapists were found!' });
        }

        
        return res.status(200).json({ therapist: rows });
    } catch (err) {
        console.error("Error fetching therapists:", err);
        return res.status(500).json({
            message: 'Error fetching therapists, please try again later.',
            error: err.message
        });
    }
}

export const getPatients = async (req, res) => {
    const query = `SELECT * FROM patient;`;

    try {
        const { rows } = await db.query(query);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No patients were found!' });
        }

        
        return res.status(200).json({ patients: rows });
    } catch (err) {
        console.error("Error fetching patients:", err);
        return res.status(500).json({
            message: 'Error fetching patients, please try again later.',
            error: err.message
        });
    }
}

export const getPatientAndUserEmailById = async (req, res) => {
    const { id } = req.params;

    const patientQuery = `SELECT * FROM patient WHERE id = $1;`;
    const userEmailQuery = `SELECT email FROM users WHERE id = $1;`;

    try {
        // Step 1: Get the patient by ID
        const patientResult = await db.query(patientQuery, [id]);

        if (patientResult.rows.length === 0) {
            return res.status(404).json({ message: 'No patient found with this id!' });
        }

        const patient = patientResult.rows[0];
    
        const userId = patient.userid;

        if (!userId) {
            return res.status(400).json({ message: 'No user_id associated with this patient.' });
        }

        // Step 2: Get the user's email using userId
        const userResult = await db.query(userEmailQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'No user found for this patient.' });
        }

        const userEmail = userResult.rows[0].email;

        // Step 3: Respond with patient data and user email
        return res.status(200).json({
            patient,
            userEmail
        });

    } catch (err) {
        console.error('Error fetching patient or user:', err);
        return res.status(500).json({
            message: 'Error fetching patient or user, please try again later.',
            error: err.message
        });
    }
};

export const getTherapistById = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM therapist WHERE id = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No therapist found with this id!' });
        }

        
        return res.status(200).json({ therapist: rows });
    } catch (err) {
        console.error("Error fetching therapist:", err);
        return res.status(500).json({
            message: 'Error fetching therapist, please try again later.',
            error: err.message
        });
    }
}

export const getPatientById = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM patient WHERE id = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No patient found with this id!' });
        }

        return res.status(200).json({ patient: rows[0] });
    } catch (err) {
        console.error("Error fetching patient:", err);
        return res.status(500).json({
            message: 'Error fetching patient, please try again later.',
            error: err.message
        });
    }
}

export const getParentById = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM parent WHERE id = $1;`;

    try {
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No parent found with this id!' });
        }

        return res.status(200).json({ parent: rows[0] });
    } catch (err) {
        console.error("Error fetching parent:", err);
        return res.status(500).json({
            message: 'Error fetching parent, please try again later.',
            error: err.message
        });
    }
}

export const getPatientsByTherapistId = async (req, res) => {
    const { therapistId } = req.params;
    const query = `SELECT * FROM patient WHERE therapistId = $1;`;

    try {
        const { rows } = await db.query(query, [therapistId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No patients found related to this therapist!' });
        }

        
        return res.status(200).json({ patients: rows });
    } catch (err) {
        console.error("Error fetching patients:", err);
        return res.status(500).json({
            message: 'Error fetching patients, please try again later.',
            error: err.message
        });
    }
}


export const deleteUserById = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = $1;';

    try {
        const { rows } = await db.query(query);
        return res.status(200).json({ message: "user deleted successfully!" });
    } catch (err) {
        return res.status(500).json({
            message: "Couldn't delete user!",
            error: err
        });
    }
}