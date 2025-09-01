-- Initial schema for DriverConnect

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'company', 'admin')),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Driver profiles
CREATE TABLE driver_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    experience INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(100) NOT NULL,
    vehicle_types JSONB NOT NULL DEFAULT '[]',
    bio TEXT,
    availability_status VARCHAR(20) NOT NULL DEFAULT 'available' 
        CHECK (availability_status IN ('available', 'busy', 'offline')),
    documents_verified BOOLEAN DEFAULT false,
    total_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Company profiles
CREATE TABLE company_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    company_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(50),
    address TEXT,
    subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free' 
        CHECK (subscription_tier IN ('free', 'pro', 'premium')),
    contact_limit INTEGER NOT NULL DEFAULT 10,
    contacts_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Jobs
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES company_profiles(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    route TEXT NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    requirements TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES driver_profiles(id),
    company_id INTEGER NOT NULL REFERENCES company_profiles(id),
    job_id INTEGER REFERENCES jobs(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact history
CREATE TABLE contact_history (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES company_profiles(id),
    driver_id INTEGER NOT NULL REFERENCES driver_profiles(id),
    contact_method VARCHAR(20) NOT NULL DEFAULT 'platform' 
        CHECK (contact_method IN ('platform', 'whatsapp', 'phone', 'email')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_driver_profiles_location ON driver_profiles(location);
CREATE INDEX idx_driver_profiles_availability ON driver_profiles(availability_status);
CREATE INDEX idx_company_profiles_tier ON company_profiles(subscription_tier);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_reviews_driver ON reviews(driver_id);
CREATE INDEX idx_reviews_company ON reviews(company_id);
CREATE INDEX idx_contact_history_company ON contact_history(company_id);
CREATE INDEX idx_contact_history_driver ON contact_history(driver_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_profiles_updated_at
    BEFORE UPDATE ON driver_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
    BEFORE UPDATE ON company_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create database indexes
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', name || ' ' || email));
CREATE INDEX idx_driver_profiles_search ON driver_profiles USING gin(to_tsvector('english', location || ' ' || bio));
CREATE INDEX idx_company_profiles_search ON company_profiles USING gin(to_tsvector('english', company_name || ' ' || registration_number));
