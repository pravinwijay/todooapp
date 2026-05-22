import client from 'prom-client';

// 1. Initialiser le registre global Prometheus
const register = client.register;

// 2. Collecter les métriques système par défaut de Node.js (CPU, mémoire, event loop, etc.)
client.collectDefaultMetrics({
  prefix: 'node_',
  timeout: 5000,
});

// 3. Définir de nouvelles métriques applicatives personnalisées (Custom Metrics)

// Compteur de requêtes HTTP totales
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status_code'],
});

// Histogramme de la durée des requêtes (latence)
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5], // tranches de temps (buckets)
});

/**
 * Middleware Express pour intercepter chaque requête et enregistrer ses métriques
 */
export const requestMonitoring = (req, res, next) => {
  // Ignorer l'endpoint /metrics pour ne pas fausser les stats
  if (req.path === '/metrics' || req.path === '/health') {
    return next();
  }

  const start = process.hrtime();

  // Écouter l'événement de fin de réponse HTTP pour calculer le temps
  res.on('finish', () => {
    const duration = getDurationInSeconds(start);
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();

    // Incrémenter le compteur de requêtes
    httpRequestsTotal.inc({ method, route, status_code: statusCode });

    // Enregistrer la durée de traitement
    httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
  });

  next();
};

/**
 * Calculateur de durée en secondes
 */
const getDurationInSeconds = (start) => {
  const diff = process.hrtime(start);
  return diff[0] + diff[1] / 1e9;
};

/**
 * Endpoint express pour exposer les métriques au scraper Prometheus
 */
export const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
};
