# VayuSense — Railway Deployment Guide

## Architecture (3 Services)

```
┌─────────────────────────────────────────────┐
│  frontend (Next.js 14)                     │
│  Root Dir: /frontend | Builder: Railpack   │
│  Public: YES                               │
├─────────────────────────────────────────────┤
│  backend (Python FastAPI + ML)             │
│  Root Dir: /backend | Builder: Dockerfile  │
│  Public: YES (API for browser)             │
├─────────────────────────────────────────────┤
│  db (PostgreSQL + PostGIS)                 │
│  Railway PostGIS template                  │
│  Public: NO                                │
└─────────────────────────────────────────────┘
```

---

## Step 1: Push to GitHub

```bash
cd et-ai-hackathon-air-intelligence
git init
git add .
git commit -m "railway deployment ready"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

---

## Step 2: Create Railway Project

1. Go to https://railway.com/dashboard
2. Click **"New Project"**
3. Select **"Empty Project"**

---

## Step 3: Add PostGIS Database

1. In the project canvas, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Once deployed, click the database service → **"Settings"**
4. Under **"Postgres Plugin"**, deploy the **PostGIS template** (adds PostGIS 3.4 extension)
5. After PostGIS is enabled, connect via **TCP Proxy** and run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```

---

## Step 4: Add Backend Service

1. Click **"+ New"** → **"Empty Service"**
2. Name it `backend`
3. Go to **"Settings"** → **"Source"** → connect your GitHub repo
4. Set **Root Directory** to `/backend`
5. Set **Watch Paths** to `backend/**`
6. The `Dockerfile` in `backend/` will be auto-detected

### Backend Environment Variables

Go to **"Variables"** tab and add:

```
DATABASE_URL=${{db.DATABASE_URL}}
DB_HOST=${{db.PGHOST}}
DB_PORT=${{db.PGPORT}}
DB_USER=${{db.PGUSER}}
DB_PASSWORD=${{db.PGPASSWORD}}
DB_NAME=${{db.PGDATABASE}}
ENVIRONMENT=production
GEMINI_API_KEY=your_gemini_key_here
MODEL=gemini/gemini-1.5-pro
PYTHON_VERSION=3.11
```

---

## Step 5: Add Frontend Service

1. Click **"+ New"** → **"Empty Service"**
2. Name it `frontend`
3. Go to **"Settings"** → **"Source"** → connect same GitHub repo
4. Set **Root Directory** to `/frontend`
5. Set **Watch Paths** to `frontend/**`

### Frontend Environment Variables

Go to **"Variables"** tab and add:

```
DATABASE_URL=${{db.DATABASE_URL}}
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...your_token
NEXT_PUBLIC_API_BASE_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
NODE_VERSION=20
```

---

## Step 6: Enable Public Domains

1. **Frontend**: Settings → Networking → **"Generate Domain"**
2. **Backend**: Settings → Networking → **"Generate Domain"**
3. **Database**: No public domain needed (use TCP proxy for admin)

---

## Step 7: Seed Database

Connect to the database via Railway TCP proxy and run the schema:

```sql
-- Run schema.sql content here
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    industry_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    cluster_category VARCHAR(50) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_facilities_geom ON facilities USING GIST(geom);

CREATE TABLE IF NOT EXISTS telemetry_logs (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    aqi_value INTEGER NOT NULL,
    pm25 DECIMAL(6,2) NOT NULL,
    pm10 DECIMAL(6,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_telemetry_logs_created_at ON telemetry_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_logs_facility_id ON telemetry_logs(facility_id);

CREATE TABLE IF NOT EXISTS audit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    target_endpoint VARCHAR(255) NOT NULL,
    triggering_agent VARCHAR(100) NOT NULL,
    action_payload JSONB NOT NULL,
    crypto_hash VARCHAR(64) NOT NULL,
    integrity_status VARCHAR(50) DEFAULT 'SEALED' NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_ledger_crypto_hash ON audit_ledger(crypto_hash);
CREATE INDEX IF NOT EXISTS idx_audit_ledger_timestamp ON audit_ledger(timestamp DESC);
```

Then run the seed script from your local machine:
```bash
cd frontend
DATABASE_URL="postgresql://user:pass@proxy.railway.internal:5432/dbname" npm run db:seed
```

---

## Environment Variables Summary

### Frontend

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `${{db.DATABASE_URL}}` | Railway auto-reference |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | `pk.eyJ1...` | Your Mapbox token |
| `NEXT_PUBLIC_API_BASE_URL` | `${{backend.RAILWAY_PUBLIC_DOMAIN}}` | Auto-reference |
| `NODE_VERSION` | `20` | Static |

### Backend

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `${{db.DATABASE_URL}}` | Railway auto-reference |
| `DB_HOST` | `${{db.PGHOST}}` | Railway auto-reference |
| `DB_PORT` | `${{db.PGPORT}}` | Railway auto-reference |
| `DB_USER` | `${{db.PGUSER}}` | Railway auto-reference |
| `DB_PASSWORD` | `${{db.PGPASSWORD}}` | Railway auto-reference |
| `DB_NAME` | `${{db.PGDATABASE}}` | Railway auto-reference |
| `ENVIRONMENT` | `production` | Static |
| `GEMINI_API_KEY` | `your_key` | User-provided |
| `MODEL` | `gemini/gemini-1.5-pro` | Static |
| `PYTHON_VERSION` | `3.11` | Static |

---

## Files Created for Railway

```
backend/Dockerfile          # GDAL/GEOS system deps for rasterio/geopandas
backend/railway.toml        # Railway build/deploy config
backend/.dockerignore       # Keep Docker image small
frontend/railway.toml       # Railway build/deploy config
.gitignore                  # Updated: .env, __pycache__, stale files
```

---

## Fixes Applied

| Issue | File | Fix |
|-------|------|-----|
| Hardcoded `127.0.0.1:8000` | `sandbox/page.tsx` | Now uses `NEXT_PUBLIC_API_BASE_URL` |
| Hardcoded `127.0.0.1:8000` | `topology/page.tsx` | Now uses `NEXT_PUBLIC_API_BASE_URL` |

---

## Cost Estimate (Budget-Friendly)

| Service | Spec | Est. Cost |
|---------|------|-----------|
| Frontend | 512MB RAM, shared CPU | ~$1-2/mo |
| Backend | 1GB RAM, shared CPU | ~$2-5/mo |
| Database | PostGIS, 1GB RAM, 5GB disk | ~$5-10/mo |
| **Total** | | **~$8-17/mo** |

> **Tip**: Use Railway's **serverless mode** (sleep when idle) on frontend/backend to reduce costs. The database runs 24/7 and is the main cost driver.

---

## Verification Checklist

- [ ] Backend `/health` returns `{"status": "healthy", "models_loaded": true}`
- [ ] Frontend loads at generated domain
- [ ] SSE stream at `/api/telemetry/stream` returns data
- [ ] Sandbox page calls backend prediction API
- [ ] Topology page calls backend agent analysis
- [ ] Mapbox map renders correctly
- [ ] Database has PostGIS extension enabled
- [ ] All env vars set correctly in Railway dashboard
