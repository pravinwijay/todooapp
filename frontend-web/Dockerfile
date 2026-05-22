# ==========================================
# ÉTAPE 1 : Compilation de l'application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copier les configurations de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier l'intégralité du code source
COPY . .

# Argument pour injecter l'URL du backend au moment du build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Compiler l'application pour la production (génère le dossier dist)
RUN npm run build

# ==========================================
# ÉTAPE 2 : Serveur Web Nginx de Production
# ==========================================
FROM nginx:1.25-alpine

# Copier les fichiers statiques compilés du builder vers Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copier une configuration Nginx sur-mesure pour gérer le routage SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port HTTP par défaut
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
