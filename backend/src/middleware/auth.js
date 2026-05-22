import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

/**
 * Middleware pour authentifier les requêtes HTTP avec JWT.
 * Attend un header : Authorization: Bearer <token>
 */
export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Token manquant ou format incorrect.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_dev_key');

    // Vérifier si l'utilisateur existe toujours dans la BDD
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou compte supprimé.',
      });
    }

    // Injection de l'utilisateur authentifié dans la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur de validation JWT :', error.message);
    return res.status(403).json({
      success: false,
      message: 'Token invalide ou expiré.',
    });
  }
};
