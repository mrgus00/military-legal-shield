#!/bin/bash

# Production Deployment Script for militarylegalshield.com
# Comprehensive server setup with monitoring and security

set -e

DOMAIN="militarylegalshield.com"
APP_DIR="/var/www/militarylegalshield"
SERVICE_USER="militarylegal"

echo "🚀 Deploying MilitaryLegalShield to production"

# Create application user
create_app_user() {
    echo "Creating application user..."
    
    if ! id "$SERVICE_USER" &>/dev/null; then
        useradd -r -s /bin/false -d "$APP_DIR" "$SERVICE_USER"
        echo "User $SERVICE_USER created"
    else
        echo "User $SERVICE_USER already exists"
    fi
}

# Install Node.js 20
install_nodejs() {
    echo "Installing Node.js 20..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        if [[ $NODE_VERSION == v20* ]]; then
            echo "Node.js 20 already installed"
            return
        fi
    fi
    
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt-get install -y nodejs
    echo "Node.js $(node --version) installed"
}

# Install PM2 for process management
install_pm2() {
    echo "Installing PM2..."
    
    if command -v pm2 &> /dev/null; then
        echo "PM2 already installed"
        return
    fi
    
    npm install -g pm2
    pm2 startup
    echo "PM2 installed and configured"
}

# Setup application directory
setup_app_directory() {
    echo "Setting up application directory..."
    
    mkdir -p "$APP_DIR"
    chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"
    
    # Create logs directory
    mkdir -p /var/log/militarylegalshield
    chown -R "$SERVICE_USER:$SERVICE_USER" /var/log/militarylegalshield
    
    echo "Application directory configured"
}

# Deploy application code
deploy_application() {
    echo "Deploying application code..."
    
    cd "$APP_DIR"
    
    # Clone or update repository
    if [[ -d ".git" ]]; then
        git pull origin main
    else
        git clone https://github.com/YOUR_USERNAME/MilitaryLegalShield.git .
    fi
    
    # Install dependencies
    npm ci --production
    
    # Build application
    npm run build
    
    # Set ownership
    chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"
    
    echo "Application deployed successfully"
}

# Create PM2 ecosystem file
create_pm2_config() {
    echo "Creating PM2 configuration..."
    
    cat > "$APP_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'militarylegalshield',
    script: 'dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    user: 'militarylegal',
    cwd: '/var/www/militarylegalshield',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_file: '/var/log/militarylegalshield/app.log',
    out_file: '/var/log/militarylegalshield/out.log',
    error_file: '/var/log/militarylegalshield/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    node_args: '--max-old-space-size=512',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    restart_delay: 5000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
    
    chown "$SERVICE_USER:$SERVICE_USER" "$APP_DIR/ecosystem.config.js"
    echo "PM2 configuration created"
}

# Setup firewall
configure_firewall() {
    echo "Configuring firewall..."
    
    # Enable UFW
    ufw --force enable
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (adjust port if needed)
    ufw allow 22/tcp
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow application port (only from localhost)
    ufw allow from 127.0.0.1 to any port 5000
    
    echo "Firewall configured"
}

# Install monitoring tools
install_monitoring() {
    echo "Installing monitoring tools..."
    
    # Install htop for process monitoring
    apt-get install -y htop iotop nethogs
    
    # Install logrotate configuration
    cat > /etc/logrotate.d/militarylegalshield << 'EOF'
/var/log/militarylegalshield/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 militarylegal militarylegal
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
    
    echo "Monitoring tools installed"
}

# Create health check script
create_health_check() {
    echo "Creating health check script..."
    
    cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash

HEALTH_URL="https://militarylegalshield.com/api/health"
LOG_FILE="/var/log/militarylegalshield/health-check.log"

check_health() {
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [[ $RESPONSE -eq 200 ]]; then
        echo "[$TIMESTAMP] HEALTHY - HTTP $RESPONSE" >> "$LOG_FILE"
        return 0
    else
        echo "[$TIMESTAMP] UNHEALTHY - HTTP $RESPONSE" >> "$LOG_FILE"
        
        # Restart application if unhealthy
        pm2 restart militarylegalshield
        
        # Send alert (implement your notification method)
        echo "Application restarted due to health check failure" | mail -s "MilitaryLegalShield Alert" admin@militarylegalshield.com
        
        return 1
    fi
}

check_health
EOF
    
    chmod +x /usr/local/bin/health-check.sh
    
    # Add to crontab for regular health checks
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health-check.sh") | crontab -
    
    echo "Health check configured"
}

# Setup log aggregation
setup_logging() {
    echo "Setting up centralized logging..."
    
    # Install rsyslog if not present
    apt-get install -y rsyslog
    
    # Configure application logging
    cat > /etc/rsyslog.d/50-militarylegalshield.conf << 'EOF'
# MilitaryLegalShield application logs
$template MilitaryLegalFormat,"%TIMESTAMP% %HOSTNAME% %syslogtag% %msg%\n"
local0.* /var/log/militarylegalshield/app.log;MilitaryLegalFormat
& stop
EOF
    
    systemctl restart rsyslog
    echo "Logging configured"
}

# Create backup script
create_backup_script() {
    echo "Creating backup script..."
    
    cat > /usr/local/bin/backup-app.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/militarylegalshield"
APP_DIR="/var/www/militarylegalshield"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup application files
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="logs" \
    -C "$APP_DIR" .

# Backup database (if using local PostgreSQL)
if command -v pg_dump &> /dev/null; then
    pg_dump $DATABASE_URL > "$BACKUP_DIR/db_backup_$DATE.sql"
fi

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x /usr/local/bin/backup-app.sh
    
    # Schedule daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-app.sh") | crontab -
    
    echo "Backup script configured"
}

# Start application
start_application() {
    echo "Starting application..."
    
    cd "$APP_DIR"
    
    # Stop existing processes
    pm2 stop militarylegalshield 2>/dev/null || true
    pm2 delete militarylegalshield 2>/dev/null || true
    
    # Start with PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    echo "Application started successfully"
}

# Main deployment function
main() {
    echo "Starting production deployment for $DOMAIN"
    
    # Update system
    apt-get update
    apt-get upgrade -y
    
    # Install required packages
    apt-get install -y git curl wget unzip nginx certbot python3-certbot-nginx ufw fail2ban
    
    create_app_user
    install_nodejs
    install_pm2
    setup_app_directory
    deploy_application
    create_pm2_config
    configure_firewall
    install_monitoring
    create_health_check
    setup_logging
    create_backup_script
    start_application
    
    echo "✅ Production deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment variables in $APP_DIR/.env"
    echo "2. Run SSL setup: sudo ./infrastructure/ssl-setup.sh"
    echo "3. Configure DNS records as per infrastructure/dns-config.md"
    echo "4. Test application: curl https://$DOMAIN/api/health"
    echo ""
    echo "Monitoring:"
    echo "- PM2 status: pm2 status"
    echo "- Application logs: pm2 logs militarylegalshield"
    echo "- Health check logs: tail -f /var/log/militarylegalshield/health-check.log"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)"
   exit 1
fi

# Run deployment
main "$@"