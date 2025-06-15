const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');

// Test configuration
const TEST_CONFIG = {
  hubUrl: 'http://localhost:4444/wd/hub',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  timeout: 30000,
  browsers: ['chrome', 'firefox', 'edge']
};

class MilitaryLegalShieldTests {
  constructor() {
    this.drivers = new Map();
    this.testResults = [];
  }

  // Initialize drivers for different browsers
  async initializeDrivers() {
    for (const browser of TEST_CONFIG.browsers) {
      try {
        let driver;
        const options = this.getBrowserOptions(browser);
        
        driver = await new Builder()
          .forBrowser(browser)
          .usingServer(TEST_CONFIG.hubUrl)
          .setChromeOptions(options.chrome || undefined)
          .setFirefoxOptions(options.firefox || undefined)
          .setEdgeOptions(options.edge || undefined)
          .build();

        await driver.manage().setTimeouts({
          implicit: TEST_CONFIG.timeout,
          pageLoad: TEST_CONFIG.timeout,
          script: TEST_CONFIG.timeout
        });

        this.drivers.set(browser, driver);
        console.log(`✓ ${browser} driver initialized successfully`);
      } catch (error) {
        console.error(`✗ Failed to initialize ${browser} driver:`, error.message);
      }
    }
  }

  getBrowserOptions(browser) {
    const options = {};
    
    switch (browser) {
      case 'chrome':
        options.chrome = new chrome.Options()
          .addArguments('--no-sandbox')
          .addArguments('--disable-dev-shm-usage')
          .addArguments('--disable-gpu')
          .addArguments('--window-size=1920,1080');
        break;
      case 'firefox':
        options.firefox = new firefox.Options()
          .addArguments('--width=1920')
          .addArguments('--height=1080');
        break;
      case 'edge':
        options.edge = new edge.Options()
          .addArguments('--no-sandbox')
          .addArguments('--disable-dev-shm-usage')
          .addArguments('--window-size=1920,1080');
        break;
    }
    
    return options;
  }

  // Test RSS Feed functionality
  async testRSSFeed() {
    console.log('\n📡 Testing RSS Feed Functionality...');
    
    for (const [browser, driver] of this.drivers) {
      try {
        // Test RSS XML feed
        await driver.get(`${TEST_CONFIG.baseUrl}/rss.xml`);
        const rssContent = await driver.getPageSource();
        
        const hasRSSStructure = rssContent.includes('<rss') && 
                               rssContent.includes('<channel>') && 
                               rssContent.includes('<item>');
        console.log(`✓ ${browser}: RSS XML structure valid - ${hasRSSStructure}`);

        const hasMilitaryContent = rssContent.includes('Military Legal Shield') ||
                                  rssContent.includes('UCMJ') ||
                                  rssContent.includes('military');
        console.log(`✓ ${browser}: Military content in RSS - ${hasMilitaryContent}`);

        // Test JSON feed
        await driver.get(`${TEST_CONFIG.baseUrl}/feed.json`);
        const jsonContent = await driver.getPageSource();
        
        const hasJSONStructure = jsonContent.includes('"version"') && 
                                jsonContent.includes('"items"');
        console.log(`✓ ${browser}: JSON feed structure valid - ${hasJSONStructure}`);

        this.recordTestResult('RSS Feed', browser, 'PASS');
      } catch (error) {
        console.error(`✗ ${browser}: RSS feed test failed -`, error.message);
        this.recordTestResult('RSS Feed', browser, 'FAIL', error.message);
      }
    }
  }

  // Test military tooltips functionality
  async testMilitaryTooltips() {
    console.log('\n🛡️ Testing Military Tooltips...');
    
    for (const [browser, driver] of this.drivers) {
      try {
        await driver.get(TEST_CONFIG.baseUrl);
        
        // Test tooltip presence on emergency button
        const emergencyButton = await driver.wait(
          until.elementLocated(By.css('button:contains("Emergency"), a[href*="urgent"]')),
          10000
        );
        
        // Hover to trigger tooltip
        const actions = driver.actions();
        await actions.move({ origin: emergencyButton }).perform();
        
        // Wait for tooltip to appear
        await driver.sleep(1000);
        
        const tooltips = await driver.findElements(
          By.css('.tooltip, [role="tooltip"], .military-tooltip')
        );
        console.log(`✓ ${browser}: Military tooltips found - ${tooltips.length}`);

        this.recordTestResult('Military Tooltips', browser, 'PASS');
      } catch (error) {
        console.error(`✗ ${browser}: Military tooltips test failed -`, error.message);
        this.recordTestResult('Military Tooltips', browser, 'FAIL', error.message);
      }
    }
  }

  // Test emergency legal flow
  async testEmergencyLegalFlow() {
    console.log('\n🚨 Testing Emergency Legal Request Flow...');
    
    for (const [browser, driver] of this.drivers) {
      try {
        await driver.get(`${TEST_CONFIG.baseUrl}/urgent-match`);

        // Test form fields
        const nameField = await driver.wait(
          until.elementLocated(By.css('input[name="fullName"], input[id*="name"]')),
          10000
        );
        await nameField.sendKeys('SGT John Doe');
        console.log(`✓ ${browser}: Name field functional`);

        const rankField = await driver.findElement(
          By.css('input[name="rank"], input[id*="rank"]')
        );
        await rankField.sendKeys('E-5');
        console.log(`✓ ${browser}: Rank field functional`);

        this.recordTestResult('Emergency Legal Flow', browser, 'PASS');
      } catch (error) {
        console.error(`✗ ${browser}: Emergency flow test failed -`, error.message);
        this.recordTestResult('Emergency Legal Flow', browser, 'FAIL', error.message);
      }
    }
  }

  recordTestResult(testSuite, browser, status, details = '') {
    this.testResults.push({
      testSuite,
      browser,
      status,
      details,
      timestamp: new Date().toISOString()
    });
  }

  generateTestReport() {
    console.log('\n📊 TEST REPORT SUMMARY');
    console.log('='.repeat(50));

    const suites = [...new Set(this.testResults.map(r => r.testSuite))];
    const browsers = [...new Set(this.testResults.map(r => r.browser))];

    for (const suite of suites) {
      console.log(`\n${suite}:`);
      for (const browser of browsers) {
        const result = this.testResults.find(r => r.testSuite === suite && r.browser === browser);
        if (result) {
          const status = result.status === 'PASS' ? '✓' : '✗';
          const details = result.details ? ` (${result.details})` : '';
          console.log(`  ${status} ${browser}${details}`);
        }
      }
    }

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
    console.log(`\nResults: ${passedTests}/${totalTests} tests passed`);
  }

  async runAllTests() {
    console.log('🚀 Starting Military Legal Shield Test Suite');
    
    try {
      await this.initializeDrivers();
      
      if (this.drivers.size === 0) {
        throw new Error('No browser drivers could be initialized');
      }

      await this.testRSSFeed();
      await this.testMilitaryTooltips();
      await this.testEmergencyLegalFlow();

      this.generateTestReport();

    } catch (error) {
      console.error('Test suite execution failed:', error);
    } finally {
      for (const [browser, driver] of this.drivers) {
        try {
          await driver.quit();
          console.log(`✓ ${browser} driver closed`);
        } catch (error) {
          console.error(`Failed to close ${browser} driver:`, error.message);
        }
      }
    }
  }
}

module.exports = MilitaryLegalShieldTests;

if (require.main === module) {
  const tests = new MilitaryLegalShieldTests();
  tests.runAllTests()
    .then(() => {
      console.log('Test execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}