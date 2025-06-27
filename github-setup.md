# GitHub Repository Setup for Military Legal Shield

## Repository Creation Steps

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `military-legal-shield`
3. Description: `Comprehensive military legal support platform with AI-powered assistance`
4. Set to Public (for open source) or Private (for proprietary)
5. Initialize with README: No (we have our own)
6. Add .gitignore: No (we have our own)
7. Add license: Choose appropriate license

### 2. Local Git Setup
```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Military Legal Shield platform with comprehensive features"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/military-legal-shield.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Configure Repository Settings

#### Secrets (for GitHub Actions)
Go to Settings > Secrets and variables > Actions and add:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `GA_MEASUREMENT_ID`
- `SESSION_SECRET`

#### Branch Protection
- Enable branch protection for `main`
- Require pull request reviews
- Require status checks to pass
- Require up-to-date branches

#### Pages (if using GitHub Pages)
- Source: GitHub Actions
- Custom domain: militarylegalshield.com

## Repository Structure
```
military-legal-shield/
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared types and schemas
├── .github/workflows/      # GitHub Actions
├── docs/                   # Documentation
├── scripts/                # Deployment scripts
├── README.md              # Project overview
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
├── vite.config.ts         # Vite configuration
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
├── nginx.conf             # Nginx configuration
└── deploy.sh              # Deployment script
```

## Deployment Integration

### Replit Integration
1. Link GitHub repository to Replit
2. Enable automatic deployments on push to main
3. Configure environment variables
4. Set up custom domain

### External Deployment
1. Use GitHub Actions for CI/CD
2. Deploy to your preferred hosting platform
3. Configure webhooks for automatic deployment
