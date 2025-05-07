import fs from 'fs'
import path from 'path'
// import dotenv from 'dotenv'

// dotenv.config();

const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY, 'utf8');
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY, 'utf8');

export const JWT_CONFIG = {
    privateKey: privateKey,
    publicKey: publicKey,
    expiration: '1h',
    algorithm: 'ES256'
}