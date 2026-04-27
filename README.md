# Playwright Test Suite with Email Notifications

This Playwright test suite includes automated email notifications for test execution start and completion with detailed reports.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gmail SMTP

To send emails via Gmail, you need to:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Create an [App Password](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or your OS)
   - Copy the generated 16-character password

### 3. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password
RECIPIENT_EMAIL=recipient@example.com
TEST_REPORT_TITLE=Playwright Test Report
```

**Environment Variables:**
- `GMAIL_USER`: Your Gmail address
- `GMAIL_APP_PASSWORD`: The 16-character app password (NOT your regular Gmail password)
- `RECIPIENT_EMAIL`: Where to send test reports
- `TEST_REPORT_TITLE`: Custom title for your test suite

## Running Tests

```bash
npx playwright test
```

### With Specific Browser

```bash
npx playwright test --project="Google Chrome"
npx playwright test --project="firefox"
npx playwright test --project="webkit"
```

### Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Debug Mode

```bash
npx playwright test --debug
```

## Email Notifications

### Test Start Email
- Sent before tests begin
- Contains test suite name and start time
- Subject: `[TEST START] <Test Suite Name> - <Timestamp>`

### Test End Email
- Sent after all tests complete
- Includes summary statistics:
  - Total tests
  - Passed tests
  - Failed tests
  - Skipped tests
  - Pass rate percentage
  - Execution duration
- **Attached**: Full HTML test report (`test-report.html`)
- Subject: `[TEST COMPLETE] <Test Suite Name> - <Timestamp>`

## File Structure

```
.
├── tests/
│   ├── Login.spec.js
│   └── Logout.spec.js
├── utils/
│   └── emailService.js        # Email service class
├── playwright.config.js        # Playwright configuration
├── globalSetup.js             # Setup hook (sends start email)
├── globalTeardown.js          # Teardown hook (sends end email)
├── .env                       # Environment variables (create from .env.example)
├── .env.example               # Template for .env
├── package.json
└── README.md
```

## Troubleshooting

### Email not sending?

1. **Check .env file** - Make sure all variables are set correctly
2. **Verify App Password** - Use the 16-character password without spaces
3. **Enable Less Secure App Access** - (If not using App Password)
4. **Check RECIPIENT_EMAIL** - Valid email address format
5. **Check GMAIL_USER** - Must be the same account that created the app password

### Example Error Messages

- `Error: 535 5.7.8 Username and password not accepted` → Wrong app password
- `Error: 550 5.1.1 The email account that you tried to reach does not exist` → Wrong recipient email
- `Error: connect ECONNREFUSED` → Network/firewall issue

### View Test Report

After tests complete:

```bash
npx playwright show-report
```

This opens the HTML report in your browser.

## Customization

### Modify Email Templates

Edit the email body methods in `utils/emailService.js`:
- `getTestStartEmailBody()` - Start email template
- `getTestEndEmailBody(testResults)` - End email template

### Add Custom Metrics

Update `globalTeardown.js` to parse additional metrics from the test report.

### Change Report Format

Modify `playwright.config.js` reporter settings:

```javascript
reporter: 'html', // Change to 'json', 'junit', 'markdown', etc.
```

## Features

✅ Automated email notifications on test start/end
✅ Detailed test execution summary
✅ HTML report attachment
✅ Support for multiple browsers (Chrome, Firefox, Safari)
✅ Environment-based configuration
✅ Gmail SMTP integration
✅ Professional email templates

## Notes

- Gmail SMTP requires app-specific passwords (not your regular Gmail password)
- The HTML report is attached with full test execution details
- Tests continue to run even if email fails to send
- Email service logs success/failure to console

---

**Support**: For issues or questions, check the troubleshooting section above.
