import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

// Durée de validité du token JWT (24 heures)
const JWT_EXPIRES_IN = '24h';

/**
 * Inscription d'un nouvel utilisateur
 */
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  // Validation minimale
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'L\'email et le mot de passe sont obligatoires.',
    });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet e-mail est déjà utilisé par un autre compte.',
      });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name || null,
      },
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'super_secret_dev_key',
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès !',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de l\'inscription.',
    });
  }
};

/**
 * Connexion d'un utilisateur existant
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'L\'email et le mot de passe sont obligatoires.',
    });
  }

  try {
    // Rechercher l'utilisateur par e-mail
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects (email inexistant).',
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects (mot de passe invalide).',
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'super_secret_dev_key',
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de la connexion.',
    });
  }
};
