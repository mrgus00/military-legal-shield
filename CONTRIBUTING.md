# Contributing to MilitaryLegalShield

Thank you for your interest in contributing to MilitaryLegalShield! This platform serves military personnel worldwide, and we welcome contributions from developers, legal professionals, and military community members.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Treat all contributors with respect and professionalism
- Focus on constructive feedback and collaborative problem-solving
- Maintain confidentiality regarding sensitive military legal information
- Follow all applicable laws and military regulations

## Getting Started

### Development Environment Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/MilitaryLegalShield.git
   cd MilitaryLegalShield
   ```

2. **Install Dependencies**
   ```bash
   npm ci
   ```

3. **Environment Configuration**
   ```bash
   cp supabase/environment.example .env
   # Configure your API keys and database connection
   ```

4. **Database Setup**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Development Standards

#### Code Quality
- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use consistent code formatting
- **Testing**: Write tests for new features and bug fixes

#### Security Requirements
- **Never commit sensitive data**: API keys, passwords, or personal information
- **Validate all inputs**: Use Zod schemas for data validation
- **Follow security best practices**: OWASP guidelines and military-grade security
- **Audit dependencies**: Check for known vulnerabilities

#### Accessibility Standards
- **WCAG 2.1 AA compliance**: All UI components must meet accessibility standards
- **Screen reader compatibility**: Test with assistive technologies
- **Keyboard navigation**: Ensure full keyboard accessibility
- **Color contrast**: Maintain minimum contrast ratios

## Contribution Types

### 1. Bug Reports
Use the bug report template with:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (browser, OS, device)
- Screenshots or screen recordings when applicable

### 2. Feature Requests
Submit feature requests with:
- Military use case justification
- Detailed feature description
- User story format: "As a [user type], I want [goal] so that [benefit]"
- Acceptance criteria
- Legal compliance considerations

### 3. Code Contributions
Follow this workflow:

#### Before Starting
1. Check existing issues and pull requests
2. Create or comment on relevant issue
3. Get approval for significant changes
4. Create feature branch from `main`

#### Development Process
```bash
# Create feature branch
git checkout -b feature/attorney-matching-improvement

# Make changes with atomic commits
git add .
git commit -m "feat: improve attorney matching algorithm

- Add specialty-based scoring system
- Implement location proximity weighting
- Update success rate calculation
- Add unit tests for matching logic"

# Push to your fork
git push origin feature/attorney-matching-improvement
```

#### Pull Request Requirements
- **Title**: Clear, descriptive summary
- **Description**: Link to issue, explain changes, include testing notes
- **Tests**: Add or update tests for new functionality
- **Documentation**: Update relevant documentation
- **Screenshots**: Include UI changes screenshots
- **Legal Review**: Flag any legal compliance implications

### 4. Documentation
Help improve documentation by:
- Fixing typos and clarifying instructions
- Adding code examples and use cases
- Creating guides for new contributors
- Translating content for international users

### 5. Legal Content
Military legal professionals can contribute:
- UCMJ article explanations and updates
- Legal form templates and examples
- Case study documentation (anonymized)
- Regulatory compliance updates

## Technical Guidelines

### Frontend Development
- **React Components**: Use functional components with hooks
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Forms**: react-hook-form with Zod validation

### Backend Development
- **API Design**: RESTful endpoints with consistent responses
- **Database**: Drizzle ORM with PostgreSQL
- **Authentication**: Secure session management
- **Error Handling**: Comprehensive error responses
- **Logging**: Structured logging for debugging

### Database Changes
- **Migrations**: Use Drizzle migrations for schema changes
- **Seed Data**: Update seed files for new data requirements
- **Security**: Implement Row Level Security policies
- **Performance**: Add appropriate indexes and optimize queries

## Testing Requirements

### Unit Tests
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

### Security Testing
```bash
# Security audit
npm audit
npm run security:scan
```

## Legal Compliance

### Attorney Information
- Verify attorney licenses and standing
- Confirm military law experience
- Validate contact information
- Document specializations accurately

### Data Privacy
- Protect personally identifiable information
- Follow GDPR and military privacy regulations
- Implement proper data retention policies
- Secure data transmission and storage

### Military Regulations
- Comply with DoD cybersecurity requirements
- Respect classification levels and security clearances
- Follow military communication protocols
- Maintain operational security (OPSEC)

## Review Process

### Code Review Checklist
- [ ] Code follows project standards and conventions
- [ ] Tests pass and coverage is maintained
- [ ] Security vulnerabilities addressed
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] Legal compliance verified

### Review Timeline
- **Small changes**: 1-2 business days
- **Medium features**: 3-5 business days
- **Large features**: 1-2 weeks
- **Security fixes**: Same day (priority)

## Release Process

### Version Management
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Release Notes**: Detailed changelog for each release
- **Deprecation Policy**: 90-day notice for breaking changes
- **Security Updates**: Immediate release for critical issues

### Deployment Pipeline
1. **Development**: Feature branches and pull requests
2. **Staging**: Automated testing and quality assurance
3. **Production**: Monitored deployment with rollback capability
4. **Post-deployment**: Performance monitoring and user feedback

## Community Guidelines

### Communication Channels
- **GitHub Issues**: Bug reports and feature discussions
- **Discord**: Real-time community chat
- **Email**: security@militarylegalshield.com for security issues

### Recognition
Contributors will be recognized through:
- GitHub contributor stats
- Release notes acknowledgments
- Community contributor highlights
- Optional LinkedIn recommendations

### Mentorship
New contributors can get help through:
- Detailed contribution guides
- Pair programming sessions
- Code review feedback
- Community Discord support

## Legal and Ethical Considerations

### Professional Responsibility
- Maintain attorney-client privilege protection
- Avoid unauthorized practice of law
- Respect professional boundaries
- Follow legal ethics guidelines

### Military Sensitivity
- Protect sensitive military information
- Respect classification requirements
- Follow OPSEC procedures
- Consider national security implications

### Open Source Ethics
- Respect intellectual property rights
- Follow open source license requirements
- Credit original authors and sources
- Maintain transparency in development

## Getting Help

### Technical Support
- **Documentation**: Check project wiki and guides
- **Issues**: Search existing issues before creating new ones
- **Discord**: Join community chat for real-time help
- **Email**: tech@militarylegalshield.com for complex issues

### Legal Questions
- **Attorney Network**: Contact verified military attorneys
- **Legal Resources**: Use platform legal resource library
- **Professional Consultation**: Seek independent legal advice

Thank you for contributing to MilitaryLegalShield and supporting our military community!