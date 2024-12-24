import { SignJWT, jwtVerify } from 'jose';

// Convert the secret key from string to Uint8Array
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

// Function to generate a JWT
export const generateToken = async (payload) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretKey);
};

// Function to verify a JWT
export const verifyToken = async (token) => {
    const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
    });
    return payload;
};