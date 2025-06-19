# GitHub Repository Setup for MilitaryLegalShield

## Repository Creation

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository" or go to https://github.com/new
3. Repository name: `MilitaryLegalShield`
4. Description: `AI-powered military legal support platform with PWA capabilities`
5. Set to **Public** (recommended for open source)
6. Do NOT initialize with README (project already has files)
7. Click "Create repository"

### Step 2: Connect Local Repository
```bash
# Navigate to project directory
cd /path/to/militarylegalshield

# Initialize git repository
git init
git branch -M main

# Add GitHub remote (replace [username] with your GitHub username)
git remote add origin https://github.com/[username]/MilitaryLegalShield.git

# Stage all files
git add .

# Create initial commit
git commit -m "Initial deployment: MilitaryLegalShield PWA platform with AI case analysis"

# Push to GitHub
git push -u origin main
```

### Step 3: Authentication Options

#### Option A: Personal Access Token (Recommended)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name: "MilitaryLegalShield Deployment"
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages to GitHub Package Registry)
5. Copy the token and use it as password when prompted:
   ```bash
   Username: [your-github-username]
   Password: [your-personal-access-token]
   ```

#### Option B: GitHub CLI (Alternative)
```bash
# Install GitHub CLI if available
gh auth login

# Follow prompts to authenticate
# Then push normally
git push -u origin main
```

## Repository Configuration

### Branch Protection Rules
1. Go to repository Settings → Branches
2. Add rule for `main` branch:
   - Require status checks to pass
   - Require pull request reviews
   - Restrict pushes to main branch

### GitHub Actions Secrets
Add these secrets in Settings → Secrets and variables → Actions:

```
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
OPENAI_API_KEY=sk-[your-openai-api-key]
STRIPE_SECRET_KEY=sk_[your-stripe-secret-key]
VITE_STRIPE_PUBLIC_KEY=pk_[your-stripe-public-key]
TWILIO_ACCOUNT_SID=AC[your-twilio-account-sid]
TWILIO_AUTH_TOKEN=[your-twilio-auth-token]
TWILIO_PHONE_NUMBER=+1[your-twilio-phone-number]
UNSPLASH_ACCESS_KEY=[your-unsplash-access-key]
```

### Repository Topics
Add these topics to help with discovery:
- `military-legal`
- `ai-powered`
- `progressive-web-app`
- `typescript`
- `react`
- `legal-tech`
- `veterans`
- `court-martial`
- `ucmj`

## Automated Deployment

### GitHub Actions Workflow
The repository includes `.github/workflows/deploy.yml` which automatically:
- Runs tests and security scans on pull requests
- Deploys to production on main branch pushes
- Performs health checks after deployment
- Submits sitemap to search engines

### Deployment Status
Monitor deployments at:
- Actions tab in GitHub repository
- Deployment logs and status
- Production health checks

## Repository Structure
```
MilitaryLegalShield/
├── .github/workflows/     # GitHub Actions CI/CD
├── client/               # React frontend
├── server/               # Express backend  
├── shared/               # Shared types
├── sql/                  # Database schemas
├── docs/                 # Documentation
├── docker-compose.yml    # Container orchestration
├── Dockerfile           # Production container
├── deploy.sh            # Deployment script
└── README.md            # Project documentation
```

## Development Workflow

### Feature Development
```bash
# Create feature branch
git checkout -b feature/new-legal-feature

# Make changes and commit
git add .
git commit -m "Add new legal consultation feature"

# Push branch
git push origin feature/new-legal-feature

# Create pull request on GitHub
```

### Production Deployment
```bash
# Merge to main branch triggers automatic deployment
git checkout main
git merge feature/new-legal-feature
git push origin main

# Monitor deployment in GitHub Actions
```

## Security Considerations

### Sensitive Information
- Never commit API keys or passwords
- Use GitHub Secrets for environment variables
- Review all commits before pushing
- Enable branch protection rules

### Access Control
- Use personal access tokens with minimal required scopes
- Regularly rotate access tokens
- Enable two-factor authentication on GitHub account
- Monitor repository access logs

## Troubleshooting

### Authentication Issues
```bash
# Clear git credentials
git config --global --unset user.password

# Use token authentication
git push
# Enter username and token when prompted
```

### Large File Issues
```bash
# Check repository size
git count-objects -vH

# Remove large files from history if needed
git filter-branch --tree-filter 'rm -rf path/to/large/files' HEAD
```

### Deployment Failures
1. Check GitHub Actions logs
2. Verify all secrets are configured
3. Ensure environment variables are set correctly
4. Review application logs for errors

## Repository URL
Once created, your repository will be available at:
`https://github.com/[username]/MilitaryLegalShield`

## Next Steps
1. Create the GitHub repository
2. Push the project files
3. Configure secrets and environment variables
4. Monitor first automated deployment
5. Set up custom domain DNS to point to deployed application