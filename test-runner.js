#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.processes = [];
  }

  async startSeleniumGrid() {
    console.log('🚀 Starting Selenium Grid...');
    
    return new Promise((resolve, reject) => {
      const dockerCompose = spawn('docker-compose', [
        '-f', 'docker-compose.selenium.yml',
        'up', '-d'
      ]);

      dockerCompose.stdout.on('data', (data) => {
        console.log(`Selenium Grid: ${data}`);
      });

      dockerCompose.stderr.on('data', (data) => {
        console.error(`Selenium Grid Error: ${data}`);
      });

      dockerCompose.on('close', (code) => {
        if (code === 0) {
          console.log('✓ Selenium Grid started successfully');
          setTimeout(() => resolve(), 5000); // Wait for grid to be ready
        } else {
          reject(new Error(`Selenium Grid failed to start with code ${code}`));
        }
      });
    });
  }

  async stopSeleniumGrid() {
    console.log('🛑 Stopping Selenium Grid...');
    
    return new Promise((resolve) => {
      const dockerCompose = spawn('docker-compose', [
        '-f', 'docker-compose.selenium.yml',
        'down'
      ]);

      dockerCompose.on('close', () => {
        console.log('✓ Selenium Grid stopped');
        resolve();
      });
    });
  }

  async runTests() {
    console.log('🧪 Running Military Legal Shield Tests...');
    
    return new Promise((resolve, reject) => {
      const testProcess = spawn('node', ['selenium-tests.js'], {
        env: {
          ...process.env,
          BASE_URL: process.env.BASE_URL || 'http://localhost:5000'
        }
      });

      testProcess.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      testProcess.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      testProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✓ Tests completed successfully');
          resolve();
        } else {
          reject(new Error(`Tests failed with code ${code}`));
        }
      });
    });
  }

  async checkDependencies() {
    const requiredDeps = ['selenium-webdriver'];
    const missingDeps = [];

    for (const dep of requiredDeps) {
      try {
        require.resolve(dep);
      } catch (error) {
        missingDeps.push(dep);
      }
    }

    if (missingDeps.length > 0) {
      console.log('📦 Installing missing dependencies...');
      
      return new Promise((resolve, reject) => {
        const npm = spawn('npm', ['install', ...missingDeps]);
        
        npm.on('close', (code) => {
          if (code === 0) {
            console.log('✓ Dependencies installed');
            resolve();
          } else {
            reject(new Error('Failed to install dependencies'));
          }
        });
      });
    }
  }

  async run() {
    try {
      console.log('🔧 Military Legal Shield Test Suite Runner');
      console.log('=====================================');

      await this.checkDependencies();
      await this.startSeleniumGrid();
      await this.runTests();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    } finally {
      await this.stopSeleniumGrid();
      console.log('🎯 Test run completed');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch(console.error);
}

module.exports = TestRunner;