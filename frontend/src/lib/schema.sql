-- Enable PostGIS spatial extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    industry_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    cluster_category VARCHAR(50) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL
);

-- Index for PostGIS geometry coordinate searches
CREATE INDEX IF NOT EXISTS idx_facilities_geom ON facilities USING GIST(geom);

-- 2. Telemetry Logs Time-Series Table
CREATE TABLE IF NOT EXISTS telemetry_logs (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    aqi_value INTEGER NOT NULL,
    pm25 DECIMAL(6, 2) NOT NULL,
    pm10 DECIMAL(6, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for time-series range queries and chronological sorting
CREATE INDEX IF NOT EXISTS idx_telemetry_logs_created_at ON telemetry_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_logs_facility_id ON telemetry_logs(facility_id);

-- Enable cryptographic extensions for gen_random_uuid() on older PG versions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3. Audit Ledger Table
CREATE TABLE IF NOT EXISTS audit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    target_endpoint VARCHAR(255) NOT NULL,
    triggering_agent VARCHAR(100) NOT NULL,
    action_payload JSONB NOT NULL,
    crypto_hash VARCHAR(64) NOT NULL,
    integrity_status VARCHAR(50) DEFAULT 'SEALED' NOT NULL
);

-- Indexes for high-speed indexing and retrieval
CREATE INDEX IF NOT EXISTS idx_audit_ledger_crypto_hash ON audit_ledger(crypto_hash);
CREATE INDEX IF NOT EXISTS idx_audit_ledger_timestamp ON audit_ledger(timestamp DESC);
