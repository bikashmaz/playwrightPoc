import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import EmailService from './utils/emailService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const globalTeardown = async () => {
  console.log('\n\n' + '█'.repeat(60));
  console.log('📋 TEST EXECUTION COMPLETED');
  console.log('█'.repeat(60) + '\n');
  
  try {
    const emailService = new EmailService();

    // Parse test results from the HTML report
    const reportPath = path.join(__dirname, 'playwright-report/index.html');
    let testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      success: true,
    };

    console.log('📊 Analyzing test results...\n');

    if (fs.existsSync(reportPath)) {
      try {
        const reportContent = fs.readFileSync(reportPath, 'utf-8');

        // Extract test results from HTML report using regex
        const passedMatch = reportContent.match(/(\d+)\s+passed/i);
        const failedMatch = reportContent.match(/(\d+)\s+failed/i);
        const skippedMatch = reportContent.match(/(\d+)\s+skipped/i);

        if (passedMatch) testResults.passed = parseInt(passedMatch[1]);
        if (failedMatch) testResults.failed = parseInt(failedMatch[1]);
        if (skippedMatch) testResults.skipped = parseInt(skippedMatch[1]);

        testResults.total = testResults.passed + testResults.failed + testResults.skipped;
        testResults.success = testResults.failed === 0;

        console.log('✅ Test Results:');
        console.log(`   Total Tests: ${testResults.total}`);
        console.log(`   ✅ Passed: ${testResults.passed}`);
        if (testResults.failed > 0) {
          console.log(`   ❌ Failed: ${testResults.failed}`);
        }
        if (testResults.skipped > 0) {
          console.log(`   ⊘ Skipped: ${testResults.skipped}`);
        }
        console.log(`   Pass Rate: ${testResults.total > 0 ? Math.round((testResults.passed / testResults.total) * 100) : 0}%\n`);
      } catch (error) {
        console.warn('⚠️ Could not parse test results from HTML report:', error.message);
        testResults.success = false;
      }
    } else {
      console.warn('⚠️ Test report file not found at:', reportPath);
      testResults.success = false;
    }

    // Send test end email with results
    console.log('📧 Preparing to send completion email...\n');
    await emailService.sendTestEndEmail(testResults);
    
    console.log('\n' + '█'.repeat(60));
    console.log('✅ TEST SUITE COMPLETED SUCCESSFULLY');
    console.log('█'.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Global teardown error:', error.message);
  }
};

export default globalTeardown;
