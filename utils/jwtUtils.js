import * as jose from 'jose';
import { JWT_CONFIG } from '../config/jwtConfig.js';
import dotenv from 'dotenv'


dotenv.config();

let privateKey, publicKey;

(async () => {
    privateKey = await jose.importPKCS8(JWT_CONFIG.privateKey, JWT_CONFIG.algorithm);
    publicKey = await jose.importSPKI(JWT_CONFIG.publicKey, JWT_CONFIG.algorithm);
})();


/**
 * Generates and encrypts a JWT token.
 * @param {Object} payload - The data to include in the JWT.
 * @returns {Promise<string>} - The encrypted JWT token.
 */

export const generateEncryptedToken = async (payload) => {
    try {
        const jwtToken = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: JWT_CONFIG.algorithm })
            .setIssuedAt()
            .setExpirationTime(JWT_CONFIG.expiration)
            .sign(privateKey);

        return jwtToken;
    } catch (error) {
        console.error('Error creating token: ', error.message);
        throw new Error('Failed to create token');
    }
};


export const verifyEncryptedToken = async (token) => {
    try {
        const { payload } = await jose.jwtVerify(token, publicKey);
        return payload;
    } catch (error) {
        console.error('Error verifying token: ', error.message);
        throw new Error('Invalid or expired token');
    }
}




