import { pool } from '../config/db.js';
import validator from 'validator'
import argon2 from 'argon2';

const db = pool;

import { generateEncryptedToken } from '../utils/jwtUtils.js'

// Function to sanitize inputs
function sanitizeInputs(email, password, therpistId, parentId, name, phone, age, role, specialization) {
        return {
            sanitizedEmail: validator.normalizeEmail(email, { gmail_remove_dots: false, gmail_remove_subaddress: false, gmail_convert_googlemaildotcom:false}),
            sanitizedPassword: validator.escape(password),
            sanitizedRole: role ? validator.escape(role) : null,
            sanitizedName: name? validator.escape(name) : null ,
            sanitizedPhone: phone? validator.escape(phone) : null,
            sanitizedAge: age ? validator.escape(age) : null,
            SanitizedTherapistId: therpistId ? validator.escape(therpistId) : null,
            sanitizedParentId: parentId ? validator.escape(parentId) : null,
            sanitizedSpecialization: specialization ? validator.escape(specialization) : null,
        };
}


// Function to create a user
export const register = async (req, res) => {
    console.log(req.body);
    const { email, password, role = "patient", name, age, phone, parentId = null, therapistId = null, certificateFile = null, specialization = null } = req.body;
    const allowedRoles = ["patient", "therapist", "parent"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });  
    }
    // Sanitize inputs
    const { sanitizedEmail, sanitizedPassword, SanitizedTherapistId, sanitizedParentId, sanitizedName, sanitizedAge, sanitizedPhone, sanitizedRole, sanitizedSpecialization } = sanitizeInputs(email, password, therapistId, parentId, name, phone, age, role, specialization);

    const hashedPassword = await argon2.hash(sanitizedPassword, { type: argon2.argon2id });
    const query = `
    INSERT INTO users (email, password, role)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    
    try {
        const { rows } = await db.query(query, [sanitizedEmail, hashedPassword, sanitizedRole]);
        if (role === "patient")
        {
            const patientQuery = `
            INSERT INTO patient (therapistId, parentId, name, age, phone, userId)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `;

            await db.query(patientQuery, [therapistId, parentId,sanitizedName, sanitizedAge, sanitizedPhone, rows[0].id]);
        }

        else if (role === "parent")
        {
            const parentQuery = `
            INSERT INTO parent (name, age, phone, userId)
            VALUES ($1,$2,$3,$4)
            RETURNING *;
            `;

            await db.query(parentQuery, [sanitizedName, sanitizedAge, sanitizedPhone, rows[0].id]);
        }

        else if (role === "therapist")
        {
            const therapistQuery = `
            INSERT INTO therapist (name, age, phone, userId, specialization)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
            `;

            await db.query(therapistQuery, [sanitizedName, sanitizedAge, sanitizedPhone, rows[0].id, sanitizedSpecialization]);

            // if (certificateFile)
            // {
            //     const therapistCertificate = `
            //     INSERT INTO certification (therapistId, )`
            // }
        }
        // Removing the password before returning
        const { password, ...userData } = rows[0];
        const token = await generateEncryptedToken({ id: userData.id, role: userData.role });
        return res.cookie('token', token, {
            httpOnly: true,
            samesite: 'lax',
            maxAge: 1*60*60*1000,
        }).status(201).json({
            message: 'User created successfully.',
            token: token
        });
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

export const login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            const { sanitizedEmail, sanitizedPassword } = sanitizeInputs(email, password);
            
            // // Check if user exists
            const userQuery = await db.query("SELECT * FROM users WHERE email = $1", [
                sanitizedEmail,
            ]);

            if (userQuery.rows.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const user = userQuery.rows[0];

            // // Compare passwords
            const isMatch = await argon2.verify(user.password, sanitizedPassword);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            // Generate JWT token
            const token = await generateEncryptedToken({ id: user.id, role: user.role });
            res.cookie('token', token, {
                httpOnly: true,
                samesite: 'lax',
                maxAge: 1*60*60*1000,
            }).json({ message: "Login successful", token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
};
    
export const logout = async (req, res) => {
    res.clearCookie('token', { httpOnly: true, samesite: 'lax' })
        .json({ message: "Logged out successfully!" });
}
