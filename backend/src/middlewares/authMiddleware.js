import { verifyToken } from '../utils/jwtUtil.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }

  req.user = decoded;
  next();
}
