import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    this.testStartTime = new Date();
  }

  /**
   * Send test start notification email
   */
  async sendTestStartEmail() {
    try {
      console.log('\n' + '='.repeat(60));
      console.log('📧 SENDING TEST START EMAIL');
      console.log('='.repeat(60));
      console.log(`To: ${process.env.RECIPIENT_EMAIL}`);
      console.log(`Suite: ${process.env.TEST_REPORT_TITLE}`);
      console.log(`Time: ${new Date().toLocaleString()}`);
      
      const emailBody = this.getTestStartEmailBody();
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `[TEST START] ${process.env.TEST_REPORT_TITLE} - ${new Date().toLocaleString()}`,
        html: emailBody,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ TEST START EMAIL SENT SUCCESSFULLY');
      console.log(`Response: ${info.response}`);
      console.log('='.repeat(60) + '\n');
      return true;
    } catch (error) {
      console.error('\n' + '='.repeat(60));
      console.error('❌ ERROR SENDING TEST START EMAIL');
      console.error('='.repeat(60));
      console.error(`Error: ${error.message}`);
      console.error('Check your Gmail credentials and .env file');
      console.error('='.repeat(60) + '\n');
      return false;
    }
  }

  /**
   * Send test end notification email with report
   */
  async sendTestEndEmail(testResults) {
    try {
      console.log('\n' + '='.repeat(60));
      console.log('📧 SENDING TEST COMPLETION EMAIL');
      console.log('='.repeat(60));
      console.log(`To: ${process.env.RECIPIENT_EMAIL}`);
      console.log(`Suite: ${process.env.TEST_REPORT_TITLE}`);
      console.log(`Total Tests: ${testResults.total}`);
      console.log(`Passed: ${testResults.passed}`);
      console.log(`Failed: ${testResults.failed}`);
      console.log(`Skipped: ${testResults.skipped}`);
      console.log(`Status: ${testResults.success ? '✅ PASSED' : '❌ FAILED'}`);
      
      const emailBody = this.getTestEndEmailBody(testResults);
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `[TEST COMPLETE] ${process.env.TEST_REPORT_TITLE} - ${new Date().toLocaleString()}`,
        html: emailBody,
      };

      // Attach HTML report if it exists
      const reportPath = path.join(__dirname, '../playwright-report/index.html');
      if (fs.existsSync(reportPath)) {
        mailOptions.attachments = [
          {
            filename: 'test-report.html',
            path: reportPath,
          },
        ];
        console.log('📎 Attached: test-report.html');
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ TEST COMPLETION EMAIL SENT SUCCESSFULLY');
      console.log(`Response: ${info.response}`);
      console.log('='.repeat(60) + '\n');
      return true;
    } catch (error) {
      console.error('\n' + '='.repeat(60));
      console.error('❌ ERROR SENDING TEST COMPLETION EMAIL');
      console.error('='.repeat(60));
      console.error(`Error: ${error.message}`);
      console.error('Check your Gmail credentials and .env file');
      console.error('='.repeat(60) + '\n');
      return false;
    }
  }

  /**
   * Generate test start email body
   */
  getTestStartEmailBody() {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 5px;
              text-align: center;
              margin-bottom: 20px;
            }
            .content {
              padding: 20px 0;
            }
            .footer {
              text-align: center;
              color: #888;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
            }
            .status-badge {
              display: inline-block;
              background-color: #4CAF50;
              color: white;
              padding: 5px 15px;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Test Execution Started</h1>
            </div>
            <div class="content">
              <p>Dear Team,</p>
              <p>Playwright automated tests have been initiated.</p>
              <ul>
                <li><strong>Test Suite:</strong> ${process.env.TEST_REPORT_TITLE}</li>
                <li><strong>Start Time:</strong> ${timestamp}</li>
                <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'Development'}</li>
              </ul>
              <p>You will receive a detailed report email once the tests are completed.</p>
              <div class="status-badge">IN PROGRESS</div>
            </div>
            <div class="footer">
              <p>This is an automated email notification from Playwright Test Suite</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate test end email body with results
   */
  getTestEndEmailBody(testResults) {
    const testStartTime = this.testStartTime;
    const testEndTime = new Date();
    const duration = Math.round((testEndTime - testStartTime) / 1000);

    const {
      total = 0,
      passed = 0,
      failed = 0,
      skipped = 0,
      success = true,
    } = testResults || {};

    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const statusColor = success ? '#4CAF50' : '#f44336';
    const statusText = success ? 'PASSED' : 'FAILED';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 5px;
              text-align: center;
              margin-bottom: 20px;
            }
            .content {
              padding: 20px 0;
            }
            .results-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background-color: #f9f9f9;
            }
            .results-table th,
            .results-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            .results-table th {
              background-color: #667eea;
              color: white;
              font-weight: bold;
            }
            .results-table tr:hover {
              background-color: #f5f5f5;
            }
            .metric {
              display: inline-block;
              margin: 10px 15px;
              text-align: center;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #667eea;
            }
            .metric-label {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            .status-badge {
              display: inline-block;
              background-color: ${statusColor};
              color: white;
              padding: 8px 20px;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 10px;
            }
            .passed { color: #4CAF50; }
            .failed { color: #f44336; }
            .skipped { color: #ff9800; }
            .footer {
              text-align: center;
              color: #888;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Test Execution Completed</h1>
            </div>
            <div class="content">
              <p>Dear Team,</p>
              <p>Playwright automated tests have been completed. Below is a summary of the results:</p>
              
              <table class="results-table">
                <tr>
                  <th>Metric</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
                <tr>
                  <td><strong>Total Tests</strong></td>
                  <td><strong>${total}</strong></td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td class="passed"><strong>✅ Passed</strong></td>
                  <td class="passed"><strong>${passed}</strong></td>
                  <td class="passed"><strong>${passRate}%</strong></td>
                </tr>
                <tr>
                  <td class="failed"><strong>❌ Failed</strong></td>
                  <td class="failed"><strong>${failed}</strong></td>
                  <td class="failed"><strong>${failed > 0 ? Math.round((failed / total) * 100) : 0}%</strong></td>
                </tr>
                <tr>
                  <td class="skipped"><strong>⊘ Skipped</strong></td>
                  <td class="skipped"><strong>${skipped}</strong></td>
                  <td class="skipped"><strong>${skipped > 0 ? Math.round((skipped / total) * 100) : 0}%</strong></td>
                </tr>
              </table>

              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
                <h3>Execution Details:</h3>
                <ul>
                  <li><strong>Test Suite:</strong> ${process.env.TEST_REPORT_TITLE}</li>
                  <li><strong>Start Time:</strong> ${testStartTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })}</li>
                  <li><strong>End Time:</strong> ${testEndTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })}</li>
                  <li><strong>Duration:</strong> ${duration}s (${Math.round(duration / 60)}m ${duration % 60}s)</li>
                  <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'Development'}</li>
                </ul>
              </div>

              <div class="status-badge">${statusText}</div>
              <p style="margin-top: 20px; color: #666;">
                The detailed HTML test report is attached to this email. Open it in your browser for comprehensive test execution details.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated email notification from Playwright Test Suite</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default EmailService;
