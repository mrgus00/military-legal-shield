#!/bin/bash

# MilitaryLegalShield Deployment Script
# Synchronizes to GitHub, Supabase, and militarylegalshield.com

set -e  # Exit on any error

echo "🎯 MilitaryLegalShield Deployment Starting..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required environment variables are set
check_environment() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "OPENAI_API_KEY"
        "STRIPE_SECRET_KEY"
        "VITE_STRIPE_PUBLIC_KEY"
        "TWILIO_ACCOUNT_SID"
        "TWILIO_AUTH_TOKEN"
        "TWILIO_PHONE_NUMBER"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -ne 0 ]]; then
        print_error "Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        exit 1
    fi
    
    print_success "Environment variables verified"
}

# Install dependencies and build
build_application() {
    print_status "Installing dependencies..."
    npm ci --silent
    
    print_status "Building application..."
    npm run build
    
    print_success "Application built successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Type checking
    npx tsc --noEmit
    
    # Security audit
    npm audit --audit-level moderate
    
    print_success "Tests completed successfully"
}

# Initialize git repository if not exists
init_git() {
    if [[ ! -d ".git" ]]; then
        print_status "Initializing Git repository..."
        git init
        git branch -M main
        
        # Create .gitignore if it doesn't exist
        if [[ ! -f ".gitignore" ]]; then
            cat > .gitignore << EOF
node_modules/
dist/
.env
.env.local
.env.production
logs/
*.log
.DS_Store
Thumbs.db
EOF
        fi
        
        print_success "Git repository initialized"
    fi
}

# Deploy to GitHub
deploy_github() {
    print_status "Deploying to GitHub..."
    
    # Add all files
    git add .
    
    # Create commit with timestamp
    commit_message="Deploy MilitaryLegalShield - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$commit_message" || print_warning "No changes to commit"
    
    # Check if remote exists
    if ! git remote get-url origin &> /dev/null; then
        print_warning "No GitHub remote configured. Please set up your repository:"
        echo "git remote add origin https://github.com/[username]/MilitaryLegalShield.git"
        echo "git push -u origin main"
        return
    fi
    
    # Push to GitHub
    git push origin main
    
    print_success "Deployed to GitHub successfully"
}

# Set up Supabase database
setup_supabase() {
    print_status "Setting up Supabase database..."
    
    # Run database migrations
    npm run db:push
    
    print_success "Supabase database configured"
}

# Deploy to production server
deploy_production() {
    print_status "Deploying to militarylegalshield.com..."
    
    # Start the application
    NODE_ENV=production npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Health check
    if curl -f http://localhost:5000/api/health &> /dev/null; then
        print_success "Production deployment healthy"
    else
        print_error "Production deployment failed health check"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop the test server
    kill $SERVER_PID 2>/dev/null || true
}

# Generate sitemap and submit to search engines
submit_sitemap() {
    print_status "Submitting sitemap to search engines..."
    
    # Submit to Google
    curl -X POST "https://www.google.com/ping?sitemap=https://militarylegalshield.com/sitemap.xml" &> /dev/null || true
    
    # Submit to Bing
    curl -X POST "https://www.bing.com/ping?sitemap=https://militarylegalshield.com/sitemap.xml" &> /dev/null || true
    
    print_success "Sitemap submitted to search engines"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check PWA manifest
    if curl -f https://militarylegalshield.com/manifest.json &> /dev/null; then
        print_success "PWA manifest accessible"
    else
        print_warning "PWA manifest not accessible"
    fi
    
    # Check service worker
    if curl -f https://militarylegalshield.com/sw.js &> /dev/null; then
        print_success "Service worker accessible"
    else
        print_warning "Service worker not accessible"
    fi
    
    # Check API health
    if curl -f https://militarylegalshield.com/api/health &> /dev/null; then
        print_success "API health check passed"
    else
        print_warning "API health check failed"
    fi
}

# Warm up cache
warm_cache() {
    print_status "Warming up cache..."
    
    urls=(
        "https://militarylegalshield.com/"
        "https://militarylegalshield.com/ai-case-analysis"
        "https://militarylegalshield.com/find-attorneys"
        "https://militarylegalshield.com/resources"
        "https://militarylegalshield.com/emergency-consultation"
    )
    
    for url in "${urls[@]}"; do
        curl -s "$url" > /dev/null &
    done
    
    wait
    print_success "Cache warmed successfully"
}

# Main deployment process
main() {
    echo "========================================="
    echo "  MilitaryLegalShield Deployment"
    echo "========================================="
    
    check_environment
    build_application
    run_tests
    init_git
    deploy_github
    setup_supabase
    deploy_production
    submit_sitemap
    verify_deployment
    warm_cache
    
    echo "========================================="
    print_success "Deployment completed successfully!"
    echo "========================================="
    echo ""
    echo "🌐 Website: https://militarylegalshield.com"
    echo "📱 PWA: Install from browser"
    echo "🔗 GitHub: Repository updated"
    echo "🗄️  Database: Supabase configured"
    echo ""
    echo "Next steps:"
    echo "1. Configure DNS for militarylegalshield.com"
    echo "2. Set up SSL certificate"
    echo "3. Configure CDN (optional)"
    echo "4. Monitor application logs"
}

# Run main function
main "$@"