-- MilitaryLegalShield Database Schema
-- Production deployment for Supabase/PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE military_branch AS ENUM (
    'army', 'navy', 'air_force', 'marines', 'coast_guard', 'space_force'
);

CREATE TYPE case_status AS ENUM (
    'pending', 'active', 'resolved', 'closed', 'emergency'
);

CREATE TYPE case_type AS ENUM (
    'court_martial', 'administrative', 'security_clearance', 'meb_peb', 'discharge', 'other'
);

-- Sessions table for authentication (required for Replit Auth)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- Users table (required for Replit Auth)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attorney profiles table
CREATE TABLE attorney_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    firm TEXT,
    location TEXT NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    military_branches military_branch[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    contact_info JSONB DEFAULT '{}',
    security_clearance TEXT,
    bar_admissions TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{"English"}',
    hourly_rate DECIMAL(10,2),
    consultation_fee DECIMAL(10,2),
    availability_status TEXT DEFAULT 'available',
    bio TEXT,
    education JSONB DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    case_wins INTEGER DEFAULT 0,
    case_total INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    emergency_available BOOLEAN DEFAULT false,
    virtual_consultation BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case analyses table
CREATE TABLE case_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    case_type case_type NOT NULL,
    military_branch military_branch,
    case_title TEXT NOT NULL,
    case_details JSONB NOT NULL,
    charges TEXT[] DEFAULT '{}',
    mitigating_factors TEXT[] DEFAULT '{}',
    aggravating_factors TEXT[] DEFAULT '{}',
    military_record JSONB DEFAULT '{}',
    ai_analysis JSONB,
    predicted_outcomes JSONB,
    recommendations JSONB,
    risk_assessment JSONB,
    estimated_costs JSONB,
    next_steps JSONB,
    attorney_matches JSONB,
    status case_status DEFAULT 'pending',
    urgency_level TEXT DEFAULT 'routine',
    location TEXT,
    consultation_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for optimal performance
CREATE INDEX idx_attorney_location ON attorney_profiles USING GIN (to_tsvector('english', location));
CREATE INDEX idx_attorney_specializations ON attorney_profiles USING GIN (specializations);
CREATE INDEX idx_attorney_branches ON attorney_profiles USING GIN (military_branches);
CREATE INDEX idx_attorney_availability ON attorney_profiles (availability_status, emergency_available);
CREATE INDEX idx_attorney_rating ON attorney_profiles (rating DESC, review_count DESC);

CREATE INDEX idx_case_user_id ON case_analyses (user_id);
CREATE INDEX idx_case_status ON case_analyses (status);
CREATE INDEX idx_case_urgency ON case_analyses (urgency_level);
CREATE INDEX idx_case_created_at ON case_analyses (created_at DESC);
CREATE INDEX idx_case_branch ON case_analyses (military_branch);

-- Enable Row Level Security
ALTER TABLE attorney_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Attorney profiles are viewable by everyone" 
ON attorney_profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can view their own case analyses" 
ON case_analyses FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own case analyses" 
ON case_analyses FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own case analyses" 
ON case_analyses FOR UPDATE 
USING (auth.uid()::text = user_id);

-- Insert initial attorney data
INSERT INTO attorney_profiles (name, firm, location, specializations, military_branches, experience_years, success_rate, contact_info, security_clearance, bar_admissions, hourly_rate, consultation_fee, bio, emergency_available, virtual_consultation) VALUES
('Col. James Mitchell (Ret.)', 'Mitchell Military Defense', 'Fort Bragg, NC', ARRAY['court-martial', 'administrative-separation', 'security-clearance'], ARRAY['army'], 15, 92.50, '{"phone": "+1-910-555-0123", "email": "jmitchell@mildefense.com"}', 'Top Secret', ARRAY['North Carolina', 'Federal'], 350.00, 150.00, 'Former Army JAG officer with extensive experience in complex court-martial cases and administrative actions.', true, true),

('LCDR Sarah Chen (Ret.)', 'Naval Legal Associates', 'Norfolk, VA', ARRAY['court-martial', 'meb-peb', 'discharge-upgrade'], ARRAY['navy', 'coast_guard'], 12, 89.75, '{"phone": "+1-757-555-0456", "email": "schen@navallegal.com"}', 'Secret', ARRAY['Virginia', 'Federal'], 325.00, 125.00, 'Former Navy JAG with specialization in medical evaluation board cases and disability ratings.', true, true),

('Maj. Robert Thompson (Ret.)', 'Air Force Defense Group', 'Colorado Springs, CO', ARRAY['court-martial', 'security-clearance', 'administrative'], ARRAY['air_force', 'space_force'], 18, 94.25, '{"phone": "+1-719-555-0789", "email": "rthompson@afdefense.com"}', 'Top Secret/SCI', ARRAY['Colorado', 'Federal'], 375.00, 175.00, 'Highly experienced Air Force JAG attorney specializing in security clearance appeals and complex court-martial defense.', true, true),

('Capt. Maria Rodriguez (Ret.)', 'Marine Corps Legal Defense', 'Camp Pendleton, CA', ARRAY['court-martial', 'administrative-separation', 'discharge'], ARRAY['marines'], 10, 87.50, '{"phone": "+1-760-555-0321", "email": "mrodriguez@marinelegal.com"}', 'Secret', ARRAY['California', 'Federal'], 300.00, 100.00, 'Former Marine JAG officer with extensive trial experience and focus on enlisted personnel defense.', false, true),

('Lt. Col. David Park (Ret.)', 'Joint Military Legal Services', 'Washington, DC', ARRAY['court-martial', 'security-clearance', 'meb-peb', 'administrative'], ARRAY['army', 'navy', 'air_force', 'marines'], 20, 96.00, '{"phone": "+1-202-555-0654", "email": "dpark@jointmillegal.com"}', 'Top Secret/SCI', ARRAY['District of Columbia', 'Federal'], 400.00, 200.00, 'Senior military attorney with joint service experience and specialization in high-profile cases.', true, true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;