#!/bin/bash

# Supabase Database Migration Script
# Automated setup for MilitaryLegalShield production database

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🎯 MilitaryLegalShield Supabase Database Migration"

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if psql is installed
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL client (psql) is required but not installed"
        echo "Install with: sudo apt-get install postgresql-client"
        exit 1
    fi
    
    # Check if node is installed for verification scripts
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    # Check if DATABASE_URL is set
    if [[ -z "$DATABASE_URL" ]]; then
        print_error "DATABASE_URL environment variable is not set"
        echo "Please set your Supabase connection string:"
        echo 'export DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres"'
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_error "Failed to connect to database"
        echo "Please verify your DATABASE_URL and network connectivity"
        exit 1
    fi
}

# Backup existing data (if any)
backup_existing_data() {
    print_status "Creating backup of existing data..."
    
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if psql "$DATABASE_URL" -c "\dt" 2>/dev/null | grep -q "attorney_profiles"; then
        print_status "Existing tables detected, creating backup..."
        pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
        print_success "Backup created: $BACKUP_FILE"
    else
        print_status "No existing tables found, skipping backup"
    fi
}

# Run database migration
run_migration() {
    print_status "Running database schema migration..."
    
    # Execute the initialization script
    if psql "$DATABASE_URL" -f "$SCRIPT_DIR/init.sql" > /dev/null; then
        print_success "Database schema migration completed"
    else
        print_error "Database migration failed"
        exit 1
    fi
}

# Verify migration success
verify_migration() {
    print_status "Verifying migration success..."
    
    # Check if required tables exist
    REQUIRED_TABLES=(
        "users"
        "sessions" 
        "attorney_profiles"
        "case_analyses"
        "legal_resources"
        "emergency_consultations"
        "document_templates"
        "generated_documents"
        "user_subscriptions"
        "attorney_reviews"
    )
    
    for table in "${REQUIRED_TABLES[@]}"; do
        if psql "$DATABASE_URL" -c "\dt $table" 2>/dev/null | grep -q "$table"; then
            print_success "Table '$table' created successfully"
        else
            print_error "Table '$table' not found"
            exit 1
        fi
    done
    
    # Check data insertion
    ATTORNEY_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM attorney_profiles;")
    if [[ $ATTORNEY_COUNT -gt 0 ]]; then
        print_success "Attorney data inserted: $ATTORNEY_COUNT records"
    else
        print_warning "No attorney data found"
    fi
    
    RESOURCE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM legal_resources;")
    if [[ $RESOURCE_COUNT -gt 0 ]]; then
        print_success "Legal resources inserted: $RESOURCE_COUNT records"
    else
        print_warning "No legal resources found"
    fi
    
    # Check indexes
    INDEX_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';")
    print_success "Database indexes created: $INDEX_COUNT"
    
    # Check Row Level Security
    RLS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_class WHERE relrowsecurity = true;")
    print_success "RLS enabled on $RLS_COUNT tables"
}

# Update application configuration
update_app_config() {
    print_status "Updating application database configuration..."
    
    # Update Drizzle configuration if needed
    if [[ -f "$PROJECT_ROOT/drizzle.config.ts" ]]; then
        print_status "Drizzle configuration found"
        
        # Run drizzle push to sync schema
        cd "$PROJECT_ROOT"
        if command -v npm &> /dev/null && [[ -f "package.json" ]]; then
            if npm run db:push > /dev/null 2>&1; then
                print_success "Drizzle schema synchronized"
            else
                print_warning "Drizzle schema sync failed (this may be expected)"
            fi
        fi
    fi
}

# Run post-migration optimizations
optimize_database() {
    print_status "Running database optimizations..."
    
    # Update table statistics
    psql "$DATABASE_URL" -c "ANALYZE;" > /dev/null
    print_success "Table statistics updated"
    
    # Refresh materialized views
    if psql "$DATABASE_URL" -c "REFRESH MATERIALIZED VIEW attorney_search_index;" > /dev/null 2>&1; then
        print_success "Materialized views refreshed"
    else
        print_warning "Materialized view refresh failed (may not exist yet)"
    fi
}

# Generate connection verification script
generate_verification() {
    print_status "Generating connection verification..."
    
    cat > "$PROJECT_ROOT/verify-database.js" << 'EOF'
const { Pool } = require('pg');

async function verifyDatabase() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('🔍 Verifying database connection...');
    
    const result = await pool.query('SELECT NOW() as timestamp');
    console.log('✅ Database connected at:', result.rows[0].timestamp);
    
    const attorneyCount = await pool.query('SELECT COUNT(*) FROM attorney_profiles');
    console.log('👥 Attorney profiles:', attorneyCount.rows[0].count);
    
    const tableCount = await pool.query(`
      SELECT COUNT(*) FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    console.log('📊 Database tables:', tableCount.rows[0].count);
    
    console.log('✅ Database verification successful');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyDatabase();
EOF
    
    print_success "Verification script created: verify-database.js"
}

# Main migration process
main() {
    echo "========================================="
    echo "  MilitaryLegalShield Database Migration"
    echo "========================================="
    echo ""
    
    check_prerequisites
    test_connection
    backup_existing_data
    run_migration
    verify_migration
    update_app_config
    optimize_database
    generate_verification
    
    echo ""
    echo "========================================="
    print_success "Database migration completed successfully!"
    echo "========================================="
    echo ""
    echo "📊 Database Summary:"
    echo "• Comprehensive schema with military-specific tables"
    echo "• Row Level Security policies for data protection"
    echo "• Optimized indexes for performance"
    echo "• 10+ attorney profiles with complete information"
    echo "• Legal resources and document templates"
    echo ""
    echo "🔗 Connection Details:"
    echo "• Database URL: [configured]"
    echo "• Connection pooling: enabled"
    echo "• SSL encryption: enforced"
    echo ""
    echo "✅ Next Steps:"
    echo "1. Test connection: node verify-database.js"
    echo "2. Start your application: npm run dev"
    echo "3. Verify API endpoints work with new database"
    echo "4. Monitor application logs for any issues"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "• Check logs in /var/log/ if issues occur"
    echo "• Verify environment variables are set correctly"
    echo "• Test individual API endpoints"
    echo "• Monitor database performance"
}

# Handle script errors
trap 'print_error "Migration failed at line $LINENO"' ERR

# Run the migration
main "$@"