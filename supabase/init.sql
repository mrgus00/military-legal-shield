-- MilitaryLegalShield Supabase Database Schema
-- Production-ready schema with Row Level Security

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types for military data
CREATE TYPE military_branch AS ENUM (
    'army', 'navy', 'air_force', 'marines', 'coast_guard', 'space_force'
);

CREATE TYPE case_status AS ENUM (
    'pending', 'active', 'resolved', 'closed', 'emergency'
);

CREATE TYPE case_type AS ENUM (
    'court_martial', 'administrative', 'security_clearance', 'meb_peb', 'discharge', 'other'
);

CREATE TYPE urgency_level AS ENUM (
    'routine', 'urgent', 'emergency', 'critical'
);

-- Sessions table for Replit Auth (required)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- Users table for authentication and profiles
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    military_branch military_branch,
    rank VARCHAR,
    unit VARCHAR,
    security_clearance VARCHAR,
    service_years INTEGER DEFAULT 0,
    deployment_status VARCHAR,
    emergency_contact JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attorney profiles with comprehensive information
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
    response_time VARCHAR DEFAULT '24 hours',
    practice_areas TEXT[] DEFAULT '{}',
    military_experience JSONB DEFAULT '{}',
    professional_memberships TEXT[] DEFAULT '{}',
    awards_recognition TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case analyses with AI-powered insights
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
    urgency urgency_level DEFAULT 'routine',
    location TEXT,
    consultation_requested BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    privacy_level TEXT DEFAULT 'confidential',
    case_number VARCHAR UNIQUE,
    incident_date DATE,
    jurisdiction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Military legal resources
CREATE TABLE legal_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    military_branch military_branch,
    classification TEXT DEFAULT 'unclassified',
    tags TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    subcategory TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size INTEGER,
    download_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_emergency BOOLEAN DEFAULT false,
    author TEXT,
    source TEXT,
    regulation_reference TEXT,
    effective_date DATE,
    last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    search_vector TSVECTOR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency consultations for 24/7 support
CREATE TABLE emergency_consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    attorney_id UUID REFERENCES attorney_profiles(id),
    case_analysis_id UUID REFERENCES case_analyses(id),
    urgency urgency_level NOT NULL DEFAULT 'emergency',
    situation_description TEXT NOT NULL,
    contact_method TEXT NOT NULL,
    contact_info JSONB NOT NULL,
    location TEXT,
    time_sensitive BOOLEAN DEFAULT true,
    preferred_response_time TEXT DEFAULT 'immediate',
    military_branch military_branch,
    rank TEXT,
    unit TEXT,
    deployment_status TEXT,
    chain_of_command_notified BOOLEAN DEFAULT false,
    legal_assistance_office_contacted BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending',
    response_time INTERVAL,
    consultation_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    resolution_summary TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document templates for legal forms
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL,
    military_branch military_branch,
    document_category TEXT NOT NULL,
    template_content TEXT NOT NULL,
    fields JSONB DEFAULT '{}',
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    requires_review BOOLEAN DEFAULT true,
    classification TEXT DEFAULT 'unclassified',
    version TEXT DEFAULT '1.0',
    regulation_reference TEXT,
    approval_authority TEXT,
    effective_date DATE,
    expiration_date DATE,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-generated documents
CREATE TABLE generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES document_templates(id),
    case_analysis_id UUID REFERENCES case_analyses(id),
    document_name TEXT NOT NULL,
    document_content TEXT NOT NULL,
    field_values JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft',
    file_path TEXT,
    download_count INTEGER DEFAULT 0,
    shared_with JSONB DEFAULT '{}',
    is_encrypted BOOLEAN DEFAULT true,
    digital_signature JSONB,
    notarization_required BOOLEAN DEFAULT false,
    review_status TEXT DEFAULT 'pending',
    review_notes TEXT,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription management
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    subscription_type TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    features JSONB DEFAULT '{}',
    usage_limits JSONB DEFAULT '{}',
    usage_current JSONB DEFAULT '{}',
    billing_cycle TEXT DEFAULT 'monthly',
    discount_applied JSONB,
    payment_method JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attorney reviews and ratings
CREATE TABLE attorney_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    attorney_id UUID REFERENCES attorney_profiles(id) ON DELETE CASCADE,
    case_analysis_id UUID REFERENCES case_analyses(id),
    consultation_id UUID REFERENCES emergency_consultations(id),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    review_title TEXT,
    review_content TEXT,
    would_recommend BOOLEAN DEFAULT true,
    response_time_rating INTEGER CHECK (response_time_rating >= 1 AND response_time_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    expertise_rating INTEGER CHECK (expertise_rating >= 1 AND expertise_rating <= 5),
    outcome_satisfaction INTEGER CHECK (outcome_satisfaction >= 1 AND outcome_satisfaction <= 5),
    is_verified BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    moderation_status TEXT DEFAULT 'pending',
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication logs for attorney-client interactions
CREATE TABLE communication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    attorney_id UUID REFERENCES attorney_profiles(id),
    case_analysis_id UUID REFERENCES case_analyses(id),
    consultation_id UUID REFERENCES emergency_consultations(id),
    communication_type TEXT NOT NULL, -- email, phone, video, chat
    subject TEXT,
    content TEXT,
    direction TEXT NOT NULL, -- inbound, outbound
    status TEXT DEFAULT 'sent',
    read_at TIMESTAMP WITH TIME ZONE,
    response_required BOOLEAN DEFAULT false,
    priority urgency_level DEFAULT 'routine',
    attachments JSONB DEFAULT '[]',
    encryption_status TEXT DEFAULT 'encrypted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for security and compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for performance
CREATE INDEX idx_attorney_location ON attorney_profiles USING GIN (to_tsvector('english', location));
CREATE INDEX idx_attorney_specializations ON attorney_profiles USING GIN (specializations);
CREATE INDEX idx_attorney_branches ON attorney_profiles USING GIN (military_branches);
CREATE INDEX idx_attorney_availability ON attorney_profiles (availability_status, emergency_available);
CREATE INDEX idx_attorney_rating ON attorney_profiles (rating DESC, review_count DESC);
CREATE INDEX idx_attorney_response_time ON attorney_profiles (response_time);

CREATE INDEX idx_case_user_id ON case_analyses (user_id);
CREATE INDEX idx_case_status ON case_analyses (status);
CREATE INDEX idx_case_urgency ON case_analyses (urgency);
CREATE INDEX idx_case_created_at ON case_analyses (created_at DESC);
CREATE INDEX idx_case_branch ON case_analyses (military_branch);
CREATE INDEX idx_case_type ON case_analyses (case_type);
CREATE INDEX idx_case_number ON case_analyses (case_number);

CREATE INDEX idx_resources_branch ON legal_resources (military_branch);
CREATE INDEX idx_resources_category ON legal_resources (category, subcategory);
CREATE INDEX idx_resources_tags ON legal_resources USING GIN (tags);
CREATE INDEX idx_resources_featured ON legal_resources (is_featured, is_emergency);
CREATE INDEX idx_resources_search ON legal_resources USING GIN (search_vector);

CREATE INDEX idx_emergency_status ON emergency_consultations (status, created_at DESC);
CREATE INDEX idx_emergency_urgency ON emergency_consultations (urgency, created_at DESC);
CREATE INDEX idx_emergency_user ON emergency_consultations (user_id);
CREATE INDEX idx_emergency_attorney ON emergency_consultations (attorney_id);

CREATE INDEX idx_documents_user ON generated_documents (user_id, created_at DESC);
CREATE INDEX idx_documents_template ON generated_documents (template_id);
CREATE INDEX idx_documents_status ON generated_documents (status);

CREATE INDEX idx_subscriptions_user ON user_subscriptions (user_id);
CREATE INDEX idx_subscriptions_stripe ON user_subscriptions (stripe_customer_id, stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions (status);

CREATE INDEX idx_reviews_attorney ON attorney_reviews (attorney_id, created_at DESC);
CREATE INDEX idx_reviews_rating ON attorney_reviews (overall_rating DESC);
CREATE INDEX idx_reviews_user ON attorney_reviews (user_id);

CREATE INDEX idx_communications_user ON communication_logs (user_id, created_at DESC);
CREATE INDEX idx_communications_attorney ON communication_logs (attorney_id, created_at DESC);
CREATE INDEX idx_communications_case ON communication_logs (case_analysis_id);

CREATE INDEX idx_audit_user ON audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs (action, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs (resource_type, resource_id);

-- Create full-text search indexes
CREATE INDEX idx_attorney_search ON attorney_profiles USING GIN (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(firm, '') || ' ' || coalesce(location, '') || ' ' || coalesce(bio, ''))
);

CREATE INDEX idx_resources_full_search ON legal_resources USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || array_to_string(tags, ' '))
);

-- Enable Row Level Security
ALTER TABLE attorney_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attorney_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create Row Level Security policies
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

CREATE POLICY "Legal resources are viewable by authenticated users" 
ON legal_resources FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Emergency consultations are viewable by owner" 
ON emergency_consultations FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Emergency consultations are insertable by owner" 
ON emergency_consultations FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Generated documents are viewable by owner" 
ON generated_documents FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Generated documents are insertable by owner" 
ON generated_documents FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "User subscriptions are viewable by owner" 
ON user_subscriptions FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Attorney reviews are viewable by everyone" 
ON attorney_reviews FOR SELECT 
USING (true);

CREATE POLICY "Attorney reviews are insertable by authenticated users" 
ON attorney_reviews FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Communications are viewable by participants" 
ON communication_logs FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own audit logs" 
ON audit_logs FOR SELECT 
USING (auth.uid()::text = user_id);

-- Insert comprehensive attorney data
INSERT INTO attorney_profiles (
    name, firm, location, specializations, military_branches, experience_years, 
    success_rate, contact_info, security_clearance, bar_admissions, languages,
    hourly_rate, consultation_fee, bio, emergency_available, virtual_consultation,
    response_time, practice_areas, case_wins, case_total, rating, review_count
) VALUES
-- Army Attorneys
('Col. James Mitchell (Ret.)', 'Mitchell Military Defense', 'Fort Bragg, NC', 
 ARRAY['court-martial', 'administrative-separation', 'security-clearance'], ARRAY['army'], 15, 
 92.50, '{"phone": "+1-910-555-0123", "email": "jmitchell@mildefense.com", "address": "123 Military Ave, Fort Bragg, NC 28310"}', 
 'Top Secret', ARRAY['North Carolina', 'Federal'], ARRAY['English'],
 350.00, 150.00, 'Former Army JAG officer with extensive experience in complex court-martial cases and administrative actions. Specialized in defending enlisted personnel and officers in serious misconduct cases.', 
 true, true, '2 hours', ARRAY['Criminal Defense', 'Administrative Law', 'Security Clearances'], 87, 94, 4.8, 156),

('LTC Sarah Chen (Ret.)', 'Chen Military Law Group', 'Fort Campbell, KY', 
 ARRAY['court-martial', 'meb-peb', 'discharge-upgrade'], ARRAY['army'], 12, 
 89.75, '{"phone": "+1-502-555-0456", "email": "schen@chenmillaw.com", "address": "456 Eagle Way, Fort Campbell, KY 42223"}', 
 'Secret', ARRAY['Kentucky', 'Tennessee', 'Federal'], ARRAY['English', 'Korean'],
 325.00, 125.00, 'Former Army JAG with specialization in medical evaluation board cases and disability ratings. Expert in administrative separations and discharge upgrades.', 
 true, true, '4 hours', ARRAY['Medical Boards', 'Disability Law', 'Administrative Actions'], 72, 80, 4.7, 134),

-- Navy Attorneys  
('LCDR Robert Thompson (Ret.)', 'Navy Defense Associates', 'Norfolk, VA', 
 ARRAY['court-martial', 'security-clearance', 'administrative'], ARRAY['navy', 'coast_guard'], 18, 
 94.25, '{"phone": "+1-757-555-0789", "email": "rthompson@navydefense.com", "address": "789 Ocean View Blvd, Norfolk, VA 23511"}', 
 'Top Secret/SCI', ARRAY['Virginia', 'Federal'], ARRAY['English'],
 375.00, 175.00, 'Highly experienced Navy JAG attorney specializing in security clearance appeals and complex court-martial defense. Former military judge with deep understanding of naval regulations.', 
 true, true, '1 hour', ARRAY['Security Clearances', 'Court-Martial Defense', 'Appeals'], 112, 119, 4.9, 203),

('CDR Maria Rodriguez (Ret.)', 'Rodriguez Maritime Law', 'San Diego, CA', 
 ARRAY['court-martial', 'administrative-separation', 'discharge'], ARRAY['navy', 'marines'], 14, 
 87.50, '{"phone": "+1-619-555-0321", "email": "mrodriguez@maritimelaw.com", "address": "321 Harbor Dr, San Diego, CA 92101"}', 
 'Secret', ARRAY['California', 'Federal'], ARRAY['English', 'Spanish'],
 300.00, 100.00, 'Former Navy JAG officer with extensive trial experience and focus on enlisted personnel defense. Bilingual attorney serving diverse military communities.', 
 false, true, '6 hours', ARRAY['Criminal Defense', 'Immigration Law', 'Family Law'], 65, 75, 4.6, 98),

-- Air Force Attorneys
('Col. David Park (Ret.)', 'Air Force Legal Defense', 'Colorado Springs, CO', 
 ARRAY['court-martial', 'security-clearance', 'meb-peb', 'administrative'], ARRAY['air_force', 'space_force'], 20, 
 96.00, '{"phone": "+1-719-555-0654", "email": "dpark@afdefense.com", "address": "654 Academy Blvd, Colorado Springs, CO 80840"}', 
 'Top Secret/SCI', ARRAY['Colorado', 'Federal'], ARRAY['English'],
 400.00, 200.00, 'Senior Air Force attorney with joint service experience and specialization in high-profile cases. Expert in space operations legal issues and cybersecurity matters.', 
 true, true, '30 minutes', ARRAY['Cybersecurity Law', 'Space Operations', 'Intelligence Law'], 134, 140, 4.95, 287),

('Maj. Lisa Wang (Ret.)', 'Wang Aviation Law', 'Joint Base San Antonio, TX', 
 ARRAY['court-martial', 'administrative', 'flight-violations'], ARRAY['air_force'], 10, 
 85.50, '{"phone": "+1-210-555-0987", "email": "lwang@aviationlaw.com", "address": "987 Airman Way, San Antonio, TX 78234"}', 
 'Secret', ARRAY['Texas', 'Federal'], ARRAY['English', 'Mandarin'],
 275.00, 100.00, 'Former Air Force JAG specializing in aviation-related legal issues and pilot license actions. Expert in flight safety investigations and regulatory compliance.', 
 true, true, '3 hours', ARRAY['Aviation Law', 'Regulatory Compliance', 'Safety Investigations'], 42, 49, 4.5, 76),

-- Marines Attorneys
('Col. Michael O\'Brien (Ret.)', 'Marine Corps Defense Group', 'Camp Pendleton, CA', 
 ARRAY['court-martial', 'administrative-separation', 'discharge'], ARRAY['marines'], 16, 
 91.75, '{"phone": "+1-760-555-0147", "email": "mobrien@marinedefense.com", "address": "147 Semper Fi Rd, Camp Pendleton, CA 92055"}', 
 'Secret', ARRAY['California', 'Federal'], ARRAY['English'],
 340.00, 140.00, 'Former Marine JAG with extensive combat deployment experience. Specialized in defending Marines in high-stress operational legal matters and combat-related incidents.', 
 true, true, '2 hours', ARRAY['Combat Operations Law', 'PTSD Defense', 'Deployment Issues'], 89, 97, 4.8, 145),

('LtCol. Jennifer Martinez (Ret.)', 'Martinez Military Justice', 'Quantico, VA', 
 ARRAY['court-martial', 'sexual-assault', 'administrative'], ARRAY['marines'], 13, 
 88.25, '{"phone": "+1-703-555-0258", "email": "jmartinez@marinelegal.com", "address": "258 Bulldog Ave, Quantico, VA 22134"}', 
 'Secret', ARRAY['Virginia', 'Maryland', 'Federal'], ARRAY['English', 'Spanish'],
 315.00, 125.00, 'Former Marine JAG with specialized training in sexual assault cases and victim advocacy. Expert in sensitive case handling and alternative dispute resolution.', 
 true, true, '4 hours', ARRAY['Sexual Assault Defense', 'Victim Rights', 'Alternative Dispute Resolution'], 58, 66, 4.7, 89),

-- Coast Guard Attorneys
('CAPT Thomas Johnson (Ret.)', 'Coast Guard Legal Services', 'Virginia Beach, VA', 
 ARRAY['court-martial', 'maritime-law', 'environmental'], ARRAY['coast_guard'], 19, 
 93.50, '{"phone": "+1-757-555-0369", "email": "tjohnson@coastguardlaw.com", "address": "369 Lighthouse Rd, Virginia Beach, VA 23451"}', 
 'Secret', ARRAY['Virginia', 'North Carolina', 'Federal'], ARRAY['English'],
 360.00, 160.00, 'Former Coast Guard JAG with extensive maritime law experience. Specialized in environmental compliance, search and rescue operations, and maritime safety regulations.', 
 true, true, '3 hours', ARRAY['Maritime Law', 'Environmental Compliance', 'Search and Rescue'], 76, 81, 4.8, 112),

-- Space Force Attorney
('Lt Col. Amanda Foster (Ret.)', 'Space Force Legal Solutions', 'Peterson SFB, CO', 
 ARRAY['court-martial', 'cybersecurity', 'space-operations'], ARRAY['space_force'], 8, 
 86.75, '{"phone": "+1-719-555-0741", "email": "afoster@spaceforcelaw.com", "address": "741 Satellite Blvd, Peterson SFB, CO 80914"}', 
 'Top Secret/SCI', ARRAY['Colorado', 'Federal'], ARRAY['English'],
 425.00, 200.00, 'Former Space Force JAG pioneering legal framework for space operations. Expert in emerging technology law, satellite operations, and cybersecurity regulations.', 
 true, true, '1 hour', ARRAY['Space Operations Law', 'Cybersecurity', 'Emerging Technology'], 21, 24, 4.9, 45);

-- Insert legal resources
INSERT INTO legal_resources (
    title, content, resource_type, military_branch, category, tags, 
    is_featured, is_emergency, author, regulation_reference
) VALUES
('UCMJ Article 86 - Absence Without Leave', 
 'Complete guide to Article 86 violations, including elements of proof, potential defenses, and maximum punishments. Covers unauthorized absence, missing movement, and failure to go to appointed place of duty.',
 'guide', NULL, 'UCMJ', ARRAY['ucmj', 'article-86', 'awol', 'absence'], 
 true, false, 'Military Justice Reference', '10 USC 886'),

('Security Clearance Appeal Process', 
 'Step-by-step guide for appealing security clearance denials or revocations through the Defense Office of Hearings and Appeals (DOHA). Includes timelines, required documentation, and representation options.',
 'guide', NULL, 'Security Clearance', ARRAY['security-clearance', 'doha', 'appeal', 'investigation'], 
 true, false, 'Security Clearance Division', '32 CFR 147'),

('Emergency Legal Consultation Checklist', 
 'Essential information to gather before contacting legal counsel for urgent military legal matters. Includes documentation requirements and immediate action steps.',
 'checklist', NULL, 'Emergency', ARRAY['emergency', 'consultation', 'checklist', 'urgent'], 
 true, true, 'Legal Assistance Office', 'AR 27-3'),

('Court-Martial Process Overview', 
 'Comprehensive overview of the court-martial process from preferral of charges through sentencing and appeals. Covers all three types of courts-martial and procedural rights.',
 'guide', NULL, 'Court-Martial', ARRAY['court-martial', 'process', 'defense', 'rights'], 
 true, false, 'Military Justice Division', 'RCM 101-1001'),

('Military Justice Rights Card', 
 'Know your rights under the UCMJ including Article 31 rights, access to legal counsel, and procedural protections during investigations and proceedings.',
 'reference', NULL, 'Rights', ARRAY['rights', 'article-31', 'counsel', 'investigation'], 
 true, true, 'Defense Counsel Assistance Program', '10 USC 831');

-- Insert document templates
INSERT INTO document_templates (
    name, description, template_type, military_branch, document_category, 
    template_content, fields, regulation_reference
) VALUES
('Article 138 Complaint', 
 'Template for filing a complaint under Article 138 of the UCMJ against a commanding officer for redress of grievances.',
 'complaint', NULL, 'Administrative', 
 'ARTICLE 138 COMPLAINT TEMPLATE - [COMPLAINANT_NAME], [RANK], [UNIT] hereby submits this formal complaint under Article 138, UCMJ...',
 '{"complainant_name": "text", "rank": "text", "unit": "text", "commander_name": "text", "incident_date": "date", "complaint_details": "textarea"}',
 '10 USC 938'),

('Request for Legal Assistance', 
 'Standard form for requesting military legal assistance services for personal legal matters.',
 'request', NULL, 'Legal Assistance', 
 'REQUEST FOR LEGAL ASSISTANCE - I, [SERVICE_MEMBER_NAME], [RANK], request legal assistance for the following matter: [ISSUE_TYPE]...',
 '{"service_member_name": "text", "rank": "text", "issue_type": "select", "urgency": "select", "contact_info": "text"}',
 'AR 27-3'),

('Security Clearance Statement', 
 'Template for providing additional information during security clearance investigations or appeals.',
 'statement', NULL, 'Security', 
 'SECURITY CLEARANCE STATEMENT - [SUBJECT_NAME] provides the following information regarding security clearance matter...',
 '{"subject_name": "text", "ssn": "text", "incident_description": "textarea", "mitigation_factors": "textarea"}',
 '32 CFR 147');

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attorney_profiles_updated_at BEFORE UPDATE ON attorney_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_analyses_updated_at BEFORE UPDATE ON case_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_resources_updated_at BEFORE UPDATE ON legal_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_consultations_updated_at BEFORE UPDATE ON emergency_consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_documents_updated_at BEFORE UPDATE ON generated_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update attorney ratings
CREATE OR REPLACE FUNCTION update_attorney_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE attorney_profiles 
    SET 
        rating = (
            SELECT AVG(overall_rating)::DECIMAL(3,2) 
            FROM attorney_reviews 
            WHERE attorney_id = NEW.attorney_id AND overall_rating IS NOT NULL
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM attorney_reviews 
            WHERE attorney_id = NEW.attorney_id
        )
    WHERE id = NEW.attorney_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_attorney_rating_trigger 
AFTER INSERT OR UPDATE ON attorney_reviews 
FOR EACH ROW EXECUTE FUNCTION update_attorney_rating();

-- Create function to update search vectors
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        coalesce(NEW.title, '') || ' ' || 
        coalesce(NEW.content, '') || ' ' || 
        array_to_string(NEW.tags, ' ')
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_legal_resources_search_vector 
BEFORE INSERT OR UPDATE ON legal_resources 
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Create view for attorney statistics
CREATE VIEW attorney_stats AS
SELECT 
    ap.id,
    ap.name,
    ap.firm,
    ap.location,
    ap.experience_years,
    ap.success_rate,
    ap.rating,
    ap.review_count,
    ap.emergency_available,
    COUNT(ar.id) as total_reviews,
    AVG(ar.overall_rating) as average_rating,
    COUNT(CASE WHEN ar.would_recommend = true THEN 1 END) as recommendations,
    COUNT(ec.id) as emergency_consultations_handled,
    AVG(EXTRACT(EPOCH FROM ec.response_time)/3600) as avg_response_hours
FROM attorney_profiles ap
LEFT JOIN attorney_reviews ar ON ap.id = ar.attorney_id
LEFT JOIN emergency_consultations ec ON ap.id = ec.attorney_id
GROUP BY ap.id, ap.name, ap.firm, ap.location, ap.experience_years, ap.success_rate, ap.rating, ap.review_count, ap.emergency_available;

-- Create materialized view for complex attorney searches
CREATE MATERIALIZED VIEW attorney_search_index AS
SELECT 
    ap.id,
    ap.name,
    ap.firm,
    ap.location,
    ap.specializations,
    ap.military_branches,
    ap.experience_years,
    ap.rating,
    ap.emergency_available,
    ap.virtual_consultation,
    ap.consultation_fee,
    ap.response_time,
    to_tsvector('english', 
        coalesce(ap.name, '') || ' ' || 
        coalesce(ap.firm, '') || ' ' || 
        coalesce(ap.location, '') || ' ' ||
        coalesce(ap.bio, '') || ' ' ||
        array_to_string(ap.specializations, ' ') || ' ' ||
        array_to_string(ap.practice_areas, ' ')
    ) as search_vector
FROM attorney_profiles ap
WHERE ap.availability_status = 'available';

CREATE INDEX idx_attorney_search_vector ON attorney_search_index USING GIN (search_vector);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_attorney_search_index()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY attorney_search_index;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Create user for application access
-- Note: In production, create a specific user with limited permissions
-- CREATE USER militarylegal_app WITH PASSWORD 'secure_password';
-- GRANT SELECT, INSERT, UPDATE ON specific tables TO militarylegal_app;

-- Final verification query
SELECT 'MilitaryLegalShield Supabase database schema initialized successfully' as status,
       COUNT(*) as attorney_count 
FROM attorney_profiles;