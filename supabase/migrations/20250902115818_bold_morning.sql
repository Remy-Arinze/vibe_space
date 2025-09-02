-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS vibe_space;

-- Connect to the database
\c vibe_space;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";