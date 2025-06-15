# Contributing to Military Legal Shield Platform

Thank you for your interest in contributing to the Military Legal Shield platform. This project is dedicated to providing essential legal support for military service members, and we welcome contributions that help us achieve this mission.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Accessibility Requirements](#accessibility-requirements)
- [Testing Standards](#testing-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Security Considerations](#security-considerations)

## Code of Conduct

### Our Commitment

We are committed to creating a welcoming and inclusive environment for all contributors, especially those with military backgrounds or connections to the military community.

### Expected Behavior

- Respect for all contributors regardless of background, experience level, or military affiliation
- Professional communication in all interactions
- Focus on constructive feedback and collaborative problem-solving
- Recognition that this platform serves active military personnel in critical situations

### Unacceptable Behavior

- Harassment, discrimination, or inappropriate comments
- Disrespectful language or behavior toward military service or personnel
- Sharing sensitive military information or classified content
- Compromising security or accessibility features

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 18+ installed
- PostgreSQL database access
- Basic understanding of React, TypeScript, and Express.js
- Familiarity with accessibility standards (WCAG 2.1 AA)
- Understanding of military legal terminology (helpful but not required)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/military-legal-shield.git
   cd military-legal-shield
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure required environment variables
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   npm run db:seed  # Optional: seed with sample data
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Quality Standards

#### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types in `shared/schema.ts`
- Avoid `any` types; use proper type definitions
- Implement comprehensive error handling

#### React Components
- Follow functional component patterns with hooks
- Use proper prop typing with TypeScript interfaces
- Implement proper error boundaries
- Ensure components are accessible by default

#### Backend Development
- Implement proper input validation using Zod schemas
- Use parameterized queries to prevent SQL injection
- Follow RESTful API design principles
- Implement comprehensive error handling and logging

### File Organization

```
military-legal-shield/
├── client/src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Application pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── contexts/           # React contexts
├── server/
│   ├── routes.ts           # API route definitions
│   ├── db.ts              # Database configuration
│   ├── openai.ts          # AI integration
│   └── auth/              # Authentication logic
├── shared/
│   └── schema.ts          # Shared types and schemas
└── docs/                  # Documentation
```

### Naming Conventions

- **Files**: Use kebab-case for file names (`legal-assistant.tsx`)
- **Components**: Use PascalCase (`LegalAssistant`)
- **Variables/Functions**: Use camelCase (`generateDocument`)
- **Constants**: Use SCREAMING_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)

## Accessibility Requirements

### WCAG 2.1 AA Compliance

All contributions must maintain our accessibility standards:

#### Color and Contrast
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Use color-blind friendly color combinations
- Test with accessibility tools before submitting

#### Interactive Elements
- All buttons must have accessible names
- Form inputs must have associated labels
- Interactive elements must be keyboard accessible
- Focus indicators must be clearly visible

#### Mobile Accessibility
- Touch targets minimum 44px × 44px
- Support pinch-to-zoom functionality
- Ensure readable text at 200% zoom
- Test on actual mobile devices

#### Screen Readers
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for complex interactions
- Alt text for all meaningful images
- Semantic HTML structure

### Testing Accessibility

Before submitting, run our accessibility validation:

```bash
npm run accessibility:test
npm run accessibility:audit
```

## Testing Standards

### Required Tests

#### Unit Tests
- Test all utility functions
- Test React component rendering
- Test API endpoint functionality
- Test database operations

#### Integration Tests
- Test complete user workflows
- Test API integration points
- Test authentication flows
- Test payment processing

#### Accessibility Tests
- Automated accessibility scanning
- Manual keyboard navigation testing
- Screen reader compatibility testing
- Mobile accessibility verification

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run test:accessibility

# Run end-to-end tests
npm run test:e2e
```

## Pull Request Process

### Before Submitting

1. **Code Quality**
   - Run linting: `npm run lint`
   - Fix formatting: `npm run format`
   - Run type checking: `npm run type-check`

2. **Testing**
   - All tests pass: `npm test`
   - Accessibility tests pass: `npm run test:accessibility`
   - Manual testing completed

3. **Documentation**
   - Update relevant documentation
   - Add JSDoc comments for new functions
   - Update changelog if applicable

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Accessibility improvement

## Military Context
- [ ] Changes affect military-specific functionality
- [ ] Legal terminology verified for accuracy
- [ ] Compliance with military regulations considered

## Accessibility Checklist
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility verified
- [ ] Mobile accessibility confirmed
- [ ] Focus management implemented properly

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Accessibility tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing completed

## Security
- [ ] No sensitive information exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] Security implications considered
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs all tests
   - Code quality checks performed
   - Accessibility validation executed
   - Security scanning completed

2. **Human Review**
   - Code review by maintainers
   - Military subject matter expert review (if applicable)
   - Accessibility expert review (for accessibility changes)
   - Security review (for security-related changes)

3. **Approval Requirements**
   - At least two approvals required
   - All automated checks must pass
   - Documentation must be updated
   - Accessibility standards must be maintained

## Issue Reporting

### Bug Reports

When reporting bugs, include:
- **Environment**: OS, browser, device type
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Accessibility Impact**: If the bug affects accessibility
- **Military Context**: If the bug affects military-specific features

### Feature Requests

When requesting features, include:
- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Military Use Case**: How does this help service members?
- **Accessibility Considerations**: How will this remain accessible?
- **Alternative Solutions**: Other ways to solve the problem

### Security Issues

**DO NOT** report security issues in public GitHub issues. Instead:
- Email: security@militarylegalshield.com
- Include detailed reproduction steps
- Allow reasonable time for response before disclosure

## Security Considerations

### Sensitive Information

- Never commit API keys, secrets, or credentials
- Avoid logging sensitive user information
- Use environment variables for configuration
- Implement proper input sanitization

### Military-Specific Security

- Understand OPSEC (Operations Security) implications
- Avoid exposing deployment locations or schedules
- Be cautious with military terminology that could reveal sensitive information
- Consider classification levels when handling military-related data

### Data Protection

- Implement HIPAA compliance for medical information
- Follow GDPR guidelines for international users
- Secure handling of legal documents and communications
- Proper encryption for data at rest and in transit

## Military Context Guidelines

### Understanding Our Users

Our platform serves:
- Active duty military personnel across all branches
- Reserve and National Guard members
- Military families and dependents
- Veterans transitioning to civilian life
- Personnel deployed in various global locations

### Military-Specific Considerations

#### Legal Terminology
- Use accurate military legal terms (UCMJ, Article 15, Court Martial)
- Understand rank structures across all service branches
- Recognize differences in military justice systems

#### Operational Awareness
- Consider time zones for global military presence
- Understand deployment and training cycles
- Recognize emergency nature of some legal situations
- Account for limited internet access in some locations

#### Cultural Sensitivity
- Respect military traditions and values
- Understand chain of command concepts
- Recognize unique stressors of military life
- Support military family dynamics

## Getting Help

### Development Questions
- **Discord**: Join our developer community
- **Email**: dev@militarylegalshield.com
- **Documentation**: Check our comprehensive docs

### Military Context Questions
- **Military Advisors**: Available for consultation
- **Legal Experts**: Domain-specific guidance
- **Veteran Contributors**: Peer support and insights

### Accessibility Questions
- **Accessibility Team**: accessibility@militarylegalshield.com
- **WCAG Guidelines**: Reference materials provided
- **Testing Tools**: Recommendations and tutorials

## Recognition

Contributors who make significant impacts will be recognized:
- **Hall of Honor**: Annual recognition for outstanding contributions
- **Military Appreciation**: Special recognition for veteran contributors
- **Accessibility Champions**: Recognition for accessibility improvements
- **Security Heroes**: Recognition for security enhancements

## Thank You

Your contributions help ensure that military service members have access to the legal support they need and deserve. Every improvement to this platform directly impacts the lives of those who serve our nation.

Together, we're building something that truly matters.

---

**Questions?** Reach out to our maintainer team at contributors@militarylegalshield.com