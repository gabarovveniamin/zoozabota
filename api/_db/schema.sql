-- ZooZabota Database Schema for Neon PostgreSQL
-- Run this once to initialize the database

-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Pets table (approved memorial entries)
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255) NOT NULL,
  years VARCHAR(100) NOT NULL,
  description TEXT,
  emoji VARCHAR(10) NOT NULL DEFAULT '🐱',
  photo TEXT, -- base64 encoded image
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pet requests (pending submissions from users)
CREATE TABLE IF NOT EXISTS pet_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255) NOT NULL,
  years VARCHAR(100) NOT NULL,
  description TEXT,
  emoji VARCHAR(10) NOT NULL DEFAULT '🐱',
  photo TEXT,
  email VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  tag VARCHAR(100) NOT NULL,
  title JSONB NOT NULL, -- supports both string and {ru, kz, en}
  description JSONB NOT NULL, -- supports both string and {ru, kz, en}
  image TEXT, -- base64 encoded image
  price JSONB,
  category VARCHAR(100),
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Service requests from customers
CREATE TABLE IF NOT EXISTS service_requests (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  service_title VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  comment TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_data TEXT NOT NULL, -- base64 encoded PDF
  file_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigram indexes for fuzzy search on pets
CREATE INDEX IF NOT EXISTS idx_pets_name_trgm ON pets USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_pets_breed_trgm ON pets USING gin (breed gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_pets_description_trgm ON pets USING gin (COALESCE(description, '') gin_trgm_ops);

-- Create trigram indexes for fuzzy search on services
CREATE INDEX IF NOT EXISTS idx_services_tag_trgm ON services USING gin (tag gin_trgm_ops);

-- Other useful indexes
CREATE INDEX IF NOT EXISTS idx_pet_requests_status ON pet_requests(status);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Settings table (key-value store for app configuration)
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL
);

-- Shop items table
CREATE TABLE IF NOT EXISTS shop_items (
  id SERIAL PRIMARY KEY,
  title JSONB NOT NULL,       -- {ru, kz, en}
  description JSONB NOT NULL, -- {ru, kz, en}
  price JSONB NOT NULL,       -- {ru, kz, en}
  image TEXT,                 -- base64 encoded image
  status VARCHAR(50) NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'out_of_stock')),
  category VARCHAR(100),      -- e.g. 'food', 'toys', 'care' or custom categories
  created_at TIMESTAMPTZ DEFAULT NOW()
);
