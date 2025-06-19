# SSH Key Setup for GitHub Deployment

## SSH Key Location Status
**Current Environment**: SSH tools not available in Replit environment
**Alternative**: HTTPS Git authentication with Personal Access Token

## Generate SSH Key (Local Machine)

If deploying from your local machine, generate SSH keys using:

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@militarylegalshield.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# Copy public key to clipboard (Linux)
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Copy public key to clipboard (Windows)
cat ~/.ssh/id_ed25519.pub | clip
```

## Add SSH Key to GitHub

1. Go to GitHub Settings → SSH and GPG keys
2. Click "New SSH key"
3. Title: "MilitaryLegalShield Deployment Key"
4. Paste your public key content
5. Click "Add SSH key"

## Replit Environment Alternative

Since SSH tools aren't available in Replit, use HTTPS authentication:

### Personal Access Token Method
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` and `workflow` scopes
3. Use token as password when pushing to GitHub

### Git Configuration
```bash
git config --global user.name "MilitaryLegalShield"
git config --global user.email "deploy@militarylegalshield.com"
git remote add origin https://github.com/[username]/MilitaryLegalShield.git
```

### Deploy Commands
```bash
git add .
git commit -m "Deploy MilitaryLegalShield platform"
git push -u origin main
```

## Verification

Test SSH connection:
```bash
ssh -T git@github.com
```

Expected response:
```
Hi [username]! You've successfully authenticated, but GitHub does not provide shell access.
```

## Repository Setup Complete

Your MilitaryLegalShield platform is ready for GitHub deployment with comprehensive PWA functionality, AI-powered case analysis, and production-ready configuration files.