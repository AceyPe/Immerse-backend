/**
 * Middleware-friendly token verification.
 *
 * @param {string} token - The JWT token from headers.
 * @returns {Object} - The decoded payload.
 * @throws {Error} - If the token is invalid or expired.
 */
export const validateAccessToken = async (token) => {
    if (!token) {
        throw new Error('Token not provided');
    }

    return await verifyToken(token);
};

/**
 * Refresh token logic (example placeholder).
 * 
 * @param {Object} user - The user object.
 * @returns {Promise<string>} - A new JWT token with an extended expiration time.
 */
export const createRefreshToken = async (user) => {
    const payload = {
        userId: user.id,
    };

    // Refresh tokens typically last much longer than access tokens
    return await generateToken(payload, '7d');
};

/**
 * Check user role from token payload.
 *
 * @param {Object} payload - The JWT payload.
 * @param {string} requiredRole - The required role (e.g., 'admin').
 * @returns {boolean} - Whether the user has the required role.
 */
export const checkUserRole = (payload, requiredRole) => {
    return payload.role && payload.role === requiredRole;
};