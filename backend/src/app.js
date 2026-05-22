import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import prisma from './config/db.js';
import { requestMonitoring, metricsEndpoint } from './middleware/monitoring.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enregistrer le middleware de collecte des métriques en premier
app.use(requestMonitoring);

// Configuration des middlewares globaux
app.use(cors({
  origin: '*', // Permet toutes les origines en développement, à restreindre en production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes applicatives
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Endpoint d'exposition des métriques Prometheus
app.get('/metrics', metricsEndpoint);

// Endpoint de vérification de l'état (Healthcheck)
// Utile pour Docker, Kubernetes ou les load balancers
app.get('/health', async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: 'UP',
      database: 'CONNECTED',
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'DOWN',
      database: 'DISCONNECTED',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Route racine informative
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API REST de la Todo App DevOps !',
    documentation: '/api/docs (bientôt disponible)',
    version: '1.0.0'
  });
});

// Middleware de gestion globale des routes non trouvées (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `La route demandée ${req.originalUrl} n'existe pas.`
  });
});

// Middleware de gestion globale des erreurs (5xx)
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur interne est survenue sur le serveur.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Démarrer le serveur uniquement s'il n'est pas importé (pour les tests unitaires)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Serveur démarré avec succès sur le port ${PORT}`);
    console.log(`👉 Mode : ${process.env.NODE_ENV || 'développement'}`);
    console.log(`👉 Healthcheck : http://localhost:${PORT}/health`);
    console.log(`=============================================`);
  });
}

export default app;
