#!/bin/bash

# SSL Certificate Setup for militarylegalshield.com
# Automated Let's Encrypt certificate installation

set -e

echo "🔒 Setting up SSL certificates for militarylegalshield.com"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

# Install Certbot if not present
install_certbot() {
    print_status "Installing Certbot..."
    
    if command -v certbot &> /dev/null; then
        print_success "Certbot already installed"
        return
    fi
    
    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    # CentOS/RHEL
    elif command -v yum &> /dev/null; then
        yum install -y epel-release
        yum install -y certbot python3-certbot-nginx
    # Amazon Linux 2
    elif command -v amazon-linux-extras &> /dev/null; then
        amazon-linux-extras install -y epel
        yum install -y certbot python3-certbot-nginx
    else
        print_error "Unsupported OS. Please install certbot manually."
        exit 1
    fi
    
    print_success "Certbot installed successfully"
}

# Install nginx if not present
install_nginx() {
    print_status "Installing nginx..."
    
    if command -v nginx &> /dev/null; then
        print_success "Nginx already installed"
        return
    fi
    
    if command -v apt-get &> /dev/null; then
        apt-get install -y nginx
    elif command -v yum &> /dev/null; then
        yum install -y nginx
    else
        print_error "Unable to install nginx automatically"
        exit 1
    fi
    
    systemctl enable nginx
    systemctl start nginx
    print_success "Nginx installed and started"
}

# Create initial nginx configuration
create_initial_config() {
    print_status "Creating initial nginx configuration..."
    
    cat > /etc/nginx/sites-available/militarylegalshield.com << 'EOF'
server {
    listen 80;
    server_name militarylegalshield.com www.militarylegalshield.com;
    
    # Let's Encrypt challenge location
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri =404;
    }
    
    # Temporary redirect to HTTPS will be added after SSL setup
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # Create symlink to sites-enabled
    ln -sf /etc/nginx/sites-available/militarylegalshield.com /etc/nginx/sites-enabled/
    
    # Create webroot directory
    mkdir -p /var/www/certbot
    
    # Test nginx configuration
    nginx -t
    systemctl reload nginx
    
    print_success "Initial nginx configuration created"
}

# Obtain SSL certificate
obtain_certificate() {
    print_status "Obtaining SSL certificate from Let's Encrypt..."
    
    # Create certificate directory
    mkdir -p /etc/letsencrypt/live/militarylegalshield.com
    
    # Request certificate
    certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@militarylegalshield.com \
        --agree-tos \
        --no-eff-email \
        --domains militarylegalshield.com,www.militarylegalshield.com \
        --non-interactive
    
    if [[ $? -eq 0 ]]; then
        print_success "SSL certificate obtained successfully"
    else
        print_error "Failed to obtain SSL certificate"
        exit 1
    fi
}

# Create production nginx configuration with SSL
create_ssl_config() {
    print_status "Creating production nginx configuration with SSL..."
    
    cat > /etc/nginx/sites-available/militarylegalshield.com << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name militarylegalshield.com www.militarylegalshield.com;
    
    # Let's Encrypt challenge location
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri =404;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server configuration
server {
    listen 443 ssl http2;
    server_name militarylegalshield.com www.militarylegalshield.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/militarylegalshield.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/militarylegalshield.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers for Military Compliance
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://api.stripe.com https://www.google-analytics.com; frame-src https://js.stripe.com;" always;
    add_header Permissions-Policy "geolocation=(self), microphone=(), camera=()" always;
    
    # Client settings
    client_max_body_size 50M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml
        application/x-font-ttf
        application/vnd.ms-fontobject
        font/opentype;
    
    # Main application proxy
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # Static files with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
    
    # PWA specific files
    location /manifest.json {
        expires 1d;
        add_header Cache-Control "public";
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
    
    location /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
    
    # API endpoints with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check endpoint (no caching)
    location /api/health {
        access_log off;
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
    
    # Robots.txt
    location /robots.txt {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
    
    # Sitemap
    location /sitemap.xml {
        expires 1d;
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
    
    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
EOF

    # Test configuration
    nginx -t
    
    if [[ $? -eq 0 ]]; then
        systemctl reload nginx
        print_success "SSL configuration applied successfully"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
}

# Setup automatic certificate renewal
setup_auto_renewal() {
    print_status "Setting up automatic certificate renewal..."
    
    # Create renewal script
    cat > /usr/local/bin/renew-ssl.sh << 'EOF'
#!/bin/bash
certbot renew --quiet --no-self-upgrade
if [[ $? -eq 0 ]]; then
    nginx -t && systemctl reload nginx
fi
EOF

    chmod +x /usr/local/bin/renew-ssl.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/renew-ssl.sh") | crontab -
    
    print_success "Automatic renewal configured"
}

# Verify SSL installation
verify_ssl() {
    print_status "Verifying SSL installation..."
    
    # Test SSL certificate
    echo | openssl s_client -connect militarylegalshield.com:443 -servername militarylegalshield.com 2>/dev/null | openssl x509 -noout -dates
    
    if [[ $? -eq 0 ]]; then
        print_success "SSL certificate verification successful"
    else
        print_warning "SSL verification failed - certificate may still be propagating"
    fi
}

# Main execution
main() {
    print_status "Starting SSL setup for militarylegalshield.com"
    
    install_nginx
    install_certbot
    create_initial_config
    
    print_warning "Ensure DNS records are pointing to this server before continuing..."
    read -p "Press Enter when DNS is configured and propagated..."
    
    obtain_certificate
    create_ssl_config
    setup_auto_renewal
    verify_ssl
    
    print_success "SSL setup completed successfully!"
    print_status "Your site is now available at https://militarylegalshield.com"
    print_status "Certificate will auto-renew every 60 days"
}

# Run main function
main "$@"