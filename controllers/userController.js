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