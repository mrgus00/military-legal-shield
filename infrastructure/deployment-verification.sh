#!/bin/bash

# Production Deployment Verification Script
# Comprehensive testing for militarylegalshield.com

DOMAIN="militarylegalshield.com"
API_BASE="https://$DOMAIN/api"

echo "🔍 Verifying production deployment for $DOMAIN"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAIL++))
    fi
}

# DNS Resolution Tests
echo "Testing DNS resolution..."
dig +short A $DOMAIN > /dev/null 2>&1
test_result $? "DNS A record resolution"

dig +short A www.$DOMAIN > /dev/null 2>&1
test_result $? "WWW DNS resolution"

# SSL Certificate Tests
echo "Testing SSL certificate..."
echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1
test_result $? "SSL certificate validity"

# HTTP to HTTPS Redirect
echo "Testing HTTPS redirect..."
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_RESPONSE" = "301" ] || [ "$HTTP_RESPONSE" = "302" ]; then
    test_result 0 "HTTP to HTTPS redirect"
else
    test_result 1 "HTTP to HTTPS redirect (got $HTTP_RESPONSE)"
fi

# Application Health Check
echo "Testing application health..."
HEALTH_RESPONSE=$(curl -s "$API_BASE/health")
echo "$HEALTH_RESPONSE" | grep -q '"status":"healthy"'
test_result $? "Application health endpoint"

# API Endpoints
echo "Testing API endpoints..."
curl -s "$API_BASE/attorneys" | head -1 | grep -q '\['
test_result $? "Attorneys API endpoint"

# PWA Manifest
echo "Testing PWA configuration..."
curl -s "https://$DOMAIN/manifest.json" | grep -q '"name"'
test_result $? "PWA manifest file"

curl -s "https://$DOMAIN/sw.js" | grep -q 'cache'
test_result $? "Service worker file"

# Security Headers
echo "Testing security headers..."
HEADERS=$(curl -sI "https://$DOMAIN")

echo "$HEADERS" | grep -qi "strict-transport-security"
test_result $? "HSTS header present"

echo "$HEADERS" | grep -qi "x-frame-options"
test_result $? "X-Frame-Options header"

echo "$HEADERS" | grep -qi "x-content-type-options"
test_result $? "X-Content-Type-Options header"

# Performance Tests
echo "Testing performance..."
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "https://$DOMAIN")
if (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    test_result 0 "Page load time under 3s ($RESPONSE_TIME s)"
else
    test_result 1 "Page load time under 3s ($RESPONSE_TIME s)"
fi

# Database Connectivity
echo "Testing database connectivity..."
curl -s "$API_BASE/health/detailed" | grep -q '"database"'
test_result $? "Database health check"

# CDN Cache Headers
echo "Testing CDN caching..."
CACHE_HEADERS=$(curl -sI "https://$DOMAIN/manifest.json")
echo "$CACHE_HEADERS" | grep -qi "cache-control"
test_result $? "Cache control headers"

# Mobile Compatibility
echo "Testing mobile compatibility..."
MOBILE_RESPONSE=$(curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "https://$DOMAIN")
echo "$MOBILE_RESPONSE" | grep -q "viewport"
test_result $? "Mobile viewport configuration"

# Final Report
echo ""
echo "========================================="
echo "Deployment Verification Summary"
echo "========================================="
echo -e "${GREEN}Passed Tests: $PASS${NC}"
echo -e "${RED}Failed Tests: $FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Deployment verified.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the issues above.${NC}"
    exit 1
fi