# 📝 Todo App - DevOps Enterprise Pipeline & Monorepo

Ce projet est une application complète de gestion de tâches (Todo App) conçue avec une approche de production moderne. Elle combine une stack technique robuste à une suite DevOps avancée couvrant l'Intégration Continue, le Déploiement Continu, l'Infrastructure as Code (IaC) et l'Observabilité totale (Monitoring/Alerting).

---

## 🏗️ Architecture Globale & DevOps Flow

```mermaid
graph TD
    %% Frontend / Backend / DB
    subgraph Local Environment (Docker Compose)
        F[React Web Frontend] -- http://localhost:5000 --> B[Node.js Express API]
        B -- Prisma ORM --> DB[(PostgreSQL Database)]
        P[Prometheus] -- Scrape /metrics --> B
        G[Grafana] -- Dashboard Query --> P
    end

    %% CI/CD Flow
    subgraph CI/CD Pipeline (GitHub Actions)
        Git[Git Push / PR] --> L[Lint & Test]
        L --> BD[Build Docker Images]
        BD --> DH[(Docker Hub Registry)]
    end

    %% IaC Flow
    subgraph Production Cloud
        T[Terraform] -- Provision --> VPS[VPS / Droplet / EC2]
        A[Ansible Playbook] -- Configure --> VPS
        VPS -- Deploys --> C_F[React Web Container]
        VPS -- Deploys --> C_B[Node.js Express Container]
        VPS -- Deploys --> C_D[(PostgreSQL Container)]
        VPS -- Deploys --> C_N[Nginx Reverse Proxy + SSL]
        VPS -- Deploys --> C_P[Prometheus Container]
        VPS -- Deploys --> C_G[Grafana Container]
    end

    DH -- Pull Images --> A
```

---

## 🛠️ Stack Technique

*   **Frontend** : React 18, React Router DOM, Axios, Context API, CSS premium réutilisable.
*   **Backend** : Node.js, Express, JWT (JSON Web Tokens), `prom-client` pour le monitoring.
*   **ORM & BDD** : Prisma ORM, PostgreSQL.
*   **Conteneurisation** : Docker, Docker Compose, builds multi-stage sécurisés.
*   **CI/CD** : GitHub Actions (Linting, Tests unitaires, Build, Push Docker Hub).
*   **IaC (Infrastructure as Code)** :
    *   **Terraform** : Provisionnement de ressources Cloud sur AWS ou DigitalOcean.
    *   **Ansible** : Automatisation de la configuration serveur (Docker, Nginx reverse proxy, HTTPS automatique avec Let's Encrypt).
*   **Monitoring & Observabilité** : Prometheus (Collecte des métriques) + Grafana (Dashboard de performance système & API).

---

## 📂 Structure du Monorepo

```text
.
├── backend/                    # API Express + Prisma + Dockerfile
├── frontend-web/               # Application React + Dockerfile
├── terraform/                  # Provisioning IaC (AWS / DigitalOcean)
├── ansible/                    # Configuration serveur & Déploiement automatisé
├── monitoring/                 # Configuration Prometheus & Grafana
├── .github/                    # Workflows CI/CD GitHub Actions
├── docker-compose.yml          # Orchestration locale multiconteneur
├── .gitignore                  # Fichiers à ignorer par Git
└── README.md                   # Documentation principale
```

---

## 🚦 Démarrage Rapide en Local

Pour lancer l'application en local dans des conteneurs isolés (Base de données, Backend, Frontend, Prometheus et Grafana) :

```bash
# Lancer tous les services
docker-compose up --build
```

L'application sera alors accessible aux adresses suivantes :
*   **Frontend React** : `http://localhost:3000`
*   **Backend API Express** : `http://localhost:5001`
*   **Prometheus** : `http://localhost:9090`
*   **Grafana** : `http://localhost:3001`
