import crypto from 'crypto';

// Generate a random 32-byte key
const secret = crypto.randomBytes(32).toString('base64');

console.log('Generated Secret Key:', secret);