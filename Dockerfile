# Multi-stage build for MilitaryLegalShield production deployment
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S militarylegal -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=militarylegal:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=militarylegal:nodejs /app/dist ./dist
COPY --from=builder --chown=militarylegal:nodejs /app/server ./server
COPY --from=builder --chown=militarylegal:nodejs /app/shared ./shared
COPY --from=builder --chown=militarylegal:nodejs /app/package.json ./

# Switch to non-root user
USER militarylegal

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]