// Comprehensive Accessibility Validation Script for Military Legal Shield
// WCAG 2.1 AA Compliance Checker

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AccessibilityValidator {
  constructor() {
    this.issues = [];
    this.checkedFiles = 0;
    this.totalElements = 0;
  }

  // Check for missing accessibility attributes on interactive elements
  validateInteractiveElements(content, filePath) {
    const buttonRegex = /<button[^>]*>/g;
    const linkRegex = /<a[^>]*>/g;
    const inputRegex = /<input[^>]*>/g;
    
    let match;
    
    // Check buttons
    while ((match = buttonRegex.exec(content)) !== null) {
      this.totalElements++;
      const buttonTag = match[0];
      
      if (!this.hasAccessibleName(buttonTag)) {
        this.issues.push({
          file: filePath,
          element: 'button',
          issue: 'Missing accessible name (aria-label, aria-labelledby, or inner text)',
          code: buttonTag,
          wcag: 'WCAG 2.1 AA - 4.1.2 Name, Role, Value',
          severity: 'critical'
        });
      }
    }
    
    // Check links
    while ((match = linkRegex.exec(content)) !== null) {
      this.totalElements++;
      const linkTag = match[0];
      
      if (!this.hasAccessibleName(linkTag)) {
        this.issues.push({
          file: filePath,
          element: 'link',
          issue: 'Missing accessible name',
          code: linkTag,
          wcag: 'WCAG 2.1 AA - 2.4.4 Link Purpose',
          severity: 'major'
        });
      }
    }
    
    // Check form inputs
    while ((match = inputRegex.exec(content)) !== null) {
      this.totalElements++;
      const inputTag = match[0];
      
      if (!this.hasFormLabel(inputTag)) {
        this.issues.push({
          file: filePath,
          element: 'input',
          issue: 'Missing form label association',
          code: inputTag,
          wcag: 'WCAG 2.1 AA - 3.3.2 Labels or Instructions',
          severity: 'major'
        });
      }
    }
  }

  hasAccessibleName(elementTag) {
    return (
      elementTag.includes('aria-label=') ||
      elementTag.includes('aria-labelledby=') ||
      elementTag.includes('title=') ||
      // Check for inner text presence (simplified check)
      !elementTag.includes('/>') // Not self-closing, likely has content
    );
  }

  hasFormLabel(inputTag) {
    return (
      inputTag.includes('aria-label=') ||
      inputTag.includes('aria-labelledby=') ||
      inputTag.includes('id=') // Assume proper label association
    );
  }

  // Validate color contrast (simplified check for common patterns)
  validateColorContrast(content, filePath) {
    const lowContrastPatterns = [
      /text-gray-400/g,
      /text-gray-300/g,
      /bg-gray-100.*text-gray-500/g
    ];

    lowContrastPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        this.issues.push({
          file: filePath,
          element: 'color',
          issue: 'Potential low color contrast',
          code: 'Color combination may not meet 4.5:1 ratio',
          wcag: 'WCAG 2.1 AA - 1.4.3 Contrast (Minimum)',
          severity: 'minor'
        });
      }
    });
  }

  // Check for proper heading hierarchy
  validateHeadingHierarchy(content, filePath) {
    const headingRegex = /<h([1-6])[^>]*>/g;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(parseInt(match[1]));
    }

    // Check for skipped heading levels
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i-1] + 1) {
        this.issues.push({
          file: filePath,
          element: 'heading',
          issue: `Heading hierarchy skip from h${headings[i-1]} to h${headings[i]}`,
          code: `h${headings[i]}`,
          wcag: 'WCAG 2.1 AA - 1.3.1 Info and Relationships',
          severity: 'major'
        });
      }
    }
  }

  // Validate images have alt text
  validateImages(content, filePath) {
    const imgRegex = /<img[^>]*>/g;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      const imgTag = match[0];
      
      if (!imgTag.includes('alt=')) {
        this.issues.push({
          file: filePath,
          element: 'image',
          issue: 'Missing alt attribute',
          code: imgTag,
          wcag: 'WCAG 2.1 AA - 1.1.1 Non-text Content',
          severity: 'critical'
        });
      }
    }
  }

  // Process a single file
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.checkedFiles++;

      this.validateInteractiveElements(content, filePath);
      this.validateColorContrast(content, filePath);
      this.validateHeadingHierarchy(content, filePath);
      this.validateImages(content, filePath);

    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error.message);
    }
  }

  // Recursively scan directory
  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        this.scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.processFile(fullPath);
      }
    });
  }

  // Generate comprehensive report
  generateReport() {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const majorIssues = this.issues.filter(i => i.severity === 'major');
    const minorIssues = this.issues.filter(i => i.severity === 'minor');

    const report = {
      summary: {
        filesChecked: this.checkedFiles,
        elementsScanned: this.totalElements,
        totalIssues: this.issues.length,
        criticalIssues: criticalIssues.length,
        majorIssues: majorIssues.length,
        minorIssues: minorIssues.length,
        complianceScore: Math.max(0, 100 - (criticalIssues.length * 10) - (majorIssues.length * 5) - (minorIssues.length * 2))
      },
      issues: this.issues,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.issues.some(i => i.element === 'button')) {
      recommendations.push({
        priority: 'high',
        action: 'Add aria-label or accessible text to all buttons',
        example: '<button aria-label="Close menu">X</button>'
      });
    }

    if (this.issues.some(i => i.element === 'image')) {
      recommendations.push({
        priority: 'high',
        action: 'Add descriptive alt text to all images',
        example: '<img src="logo.png" alt="Company logo" />'
      });
    }

    if (this.issues.some(i => i.element === 'color')) {
      recommendations.push({
        priority: 'medium',
        action: 'Review color combinations for sufficient contrast',
        example: 'Use tools like WebAIM Contrast Checker'
      });
    }

    return recommendations;
  }

  // Run complete validation
  run() {
    console.log('🔍 Starting WCAG 2.1 AA Accessibility Validation...\n');
    
    const clientPath = path.join(__dirname, 'client', 'src');
    if (fs.existsSync(clientPath)) {
      this.scanDirectory(clientPath);
    }

    const report = this.generateReport();
    
    console.log('📊 ACCESSIBILITY VALIDATION REPORT');
    console.log('================================');
    console.log(`Files Checked: ${report.summary.filesChecked}`);
    console.log(`Elements Scanned: ${report.summary.elementsScanned}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Compliance Score: ${report.summary.complianceScore}%\n`);
    
    console.log('🚨 ISSUE BREAKDOWN');
    console.log(`Critical: ${report.summary.criticalIssues}`);
    console.log(`Major: ${report.summary.majorIssues}`);
    console.log(`Minor: ${report.summary.minorIssues}\n`);
    
    if (report.issues.length > 0) {
      console.log('📋 DETAILED ISSUES');
      console.log('================');
      report.issues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.file}`);
        console.log(`   Element: ${issue.element}`);
        console.log(`   Issue: ${issue.issue}`);
        console.log(`   WCAG: ${issue.wcag}`);
        console.log(`   Code: ${issue.code}\n`);
      });
    }

    if (report.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS');
      console.log('=================');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.action}`);
        console.log(`   Example: ${rec.example}\n`);
      });
    }

    // Save detailed report
    fs.writeFileSync('accessibility-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Detailed report saved to accessibility-report.json');
    
    return report;
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new AccessibilityValidator();
  validator.run();
}

export default AccessibilityValidator;