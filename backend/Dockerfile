# ==========================================
# ÉTAPE 1 : Construction et Dépendances
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer toutes les dépendances (y compris de dev pour Prisma)
RUN npm ci

# Générer le client Prisma
RUN npm run prisma:generate

# Copier le code source de l'application
COPY src ./src/

# Supprimer les dépendances de développement pour ne garder que la production
RUN npm prune --production

# ==========================================
# ÉTAPE 2 : Image finale de Production
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Installer OpenSSL requis par le Query Engine de Prisma sous Alpine
RUN apk add --no-cache openssl

# Copier le package.json et les dépendances élaguées du builder avec les bons droits d'accès
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/src ./src
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma

# Utiliser l'utilisateur non-privilégié pour la sécurité du conteneur
USER node

# Exposer le port de l'API
EXPOSE 5000

# Lancer l'application
CMD ["node", "src/app.js"]
