# Supabase Database Configuration for MilitaryLegalShield

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `militarylegalshield`
3. Choose region closest to your users
4. Set a strong database password
5. Wait for project initialization (2-3 minutes)

### 2. Get Database Connection Details
From your Supabase dashboard:
- Go to Settings → Database
- Copy the Connection string under "Connection pooling"
- Replace `[YOUR-PASSWORD]` with your database password

### 3. Configure Environment Variables
```bash
DATABASE_URL=postgresql://postgres.xyz:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 4. Initialize Database Schema
```bash
# Run the initialization script
psql $DATABASE_URL < supabase/init.sql
```

### 5. Verify Tables Created
```sql
-- Check tables
\dt

-- Verify attorney data
SELECT count(*) FROM attorney_profiles;

-- Test case analysis table
SELECT count(*) FROM case_analyses;
```

## Database Features

### Tables Created
- `users` - User authentication and profiles
- `sessions` - Session management for Replit Auth
- `attorney_profiles` - Military defense attorneys
- `case_analyses` - AI-powered case analysis records
- `legal_resources` - Military legal documents and guides
- `emergency_consultations` - 24/7 emergency legal requests
- `document_templates` - Legal document templates
- `generated_documents` - User-generated legal documents
- `user_subscriptions` - Stripe subscription management
- `attorney_reviews` - Attorney ratings and reviews

### Security Features
- Row Level Security (RLS) enabled on all tables
- User isolation policies
- Secure authentication integration
- Audit logging capabilities

### Performance Optimizations
- Comprehensive indexing strategy
- Full-text search capabilities
- Materialized views for complex queries
- Connection pooling configuration

## Maintenance

### Regular Tasks
- Monitor query performance
- Update attorney profiles
- Backup verification
- Security audit reviews

### Scaling Considerations
- Read replicas for high traffic
- Connection pool optimization
- Query optimization monitoring
- Storage growth planning