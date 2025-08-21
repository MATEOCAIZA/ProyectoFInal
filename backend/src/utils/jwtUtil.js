import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'AAAAAAAAABBBBBCCCC';

// Generar token
export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' });
}

// Verificar token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}
