# Eat Better Project Setup Guide

This guide explains how to set up and run the **Eat Better** project. The project consists of a React frontend and relies on a Dockerized FormCMS backend with PostgreSQL.

## Prerequisites

Before starting, ensure you have the following installed:

1.  **Node.js & npm**: [Download Node.js](https://nodejs.org/) (LTS recommended)
2.  **Docker & Docker Compose**: Required to run the FormCMS backend and PostgreSQL database.

## Architecture

*   **Frontend**: Vite + React + TypeScript (located in the root of this repository).
*   **Backend**: We use FormCMS without needing a custom local backend codebase. It can be easily set up using Docker Compose.

## Getting Started

### 1. Set Up the Backend (FormCMS + PostgreSQL via Docker)

There is no need to run a local backend built from source. Instead, the backend is provided via Docker Compose using PostgreSQL and the official FormCMS image.

Create a `docker-compose.yml` file in the root directory (or use the one provided) with the following content:

```yaml
services:
  app:
    image: jaike/formcms-mono:latest
    ports:
      - "5000:5000"
    environment:
      # --- Database ---
      - DATABASE_PROVIDER=1                # 0=SQLite, 1=Postgres, 2=SqlServer, 3=MySQL
      - CONNECTION_STRING=Host=db;Port=5432;Database=cms;Username=postgres;Password=postgres;
      - DatabaseProvider=Postgres
      - "ConnectionStrings__Postgres=Host=db;Database=cms;Username=postgres;Password=postgres;"
      - FORMCMS_DATA_PATH=/data

      # --- Node.js (internal, no need to change) ---
      - PORT=3001
      - NODE_ENV=production
      - FORMCMS_BASE_URL=http://127.0.0.1:5001
      - DATABASE_URL=file:/data/mate/sqlite.db
    depends_on:
      - db
    restart: unless-stopped
    volumes:
      - formcms_data:/data

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=cms
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
  formcms_data:
```

To set up the backend, run:

```bash
docker compose up -d
```

### 2. Access the CMS and Mate App

Once the Docker containers are running, you can access the FormCMS ecosystem (default backend port is `5000`):

#### System Setup and Schema Development (Mate)
Develop and manage the database schema.
1.  **Access URL**: Open your browser to **http://localhost:5000/mate**

#### Content Management (Admin)
Manage your content and data.
1.  **Access URL**: Open your browser to **http://localhost:5000/admin**


### 3. Start the Frontend
1.  Install dependencies (first time only):
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open your browser to **http://localhost:5173**.
