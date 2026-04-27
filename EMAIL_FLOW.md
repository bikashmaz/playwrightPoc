# Email Notification Flow

## How Emails Are Triggered

### Test Start Email
```
GitHub Action Triggered
           ↓
Install Dependencies
           ↓
Create .env with credentials
           ↓
Install Playwright
           ↓
→→→ globalSetup.js runs ←←← 
│   📧 SENDS START EMAIL
│   Content: Test suite starting, timestamp
└→ Tests begin execution
```

### Test End Email
```
Tests Execution
           ↓
→→→ globalTeardown.js runs ←←←
│   📧 SENDS END EMAIL
│   Content: Test summary + attached HTML report
└→ Report uploaded to GitHub
```

## Email Timeline

| Time | Event | Email |
|------|-------|-------|
| T+0s | Workflow starts | - |
| T+30s | Dependencies installed | - |
| T+45s | Playwright installed | - |
| T+60s | globalSetup.js runs | 📧 **START EMAIL SENT** |
| T+60s | Tests begin | ⏳ Tests running |
| T+5m | Tests complete | - |
| T+5m | globalTeardown.js runs | 📧 **END EMAIL SENT** (with report) |
| T+6m | Report uploaded | ✅ Artifact available |

## GitHub Workflow Log Output

When you run tests, you'll see in the workflow logs:

```
🚀 PLAYWRIGHT TEST SUITE STARTING
═══════════════════════════════════════════════════════════════

📧 Initializing email notification service...

═══════════════════════════════════════════════════════════════
📧 SENDING TEST START EMAIL
═══════════════════════════════════════════════════════════════
To: recipient@example.com
Suite: GitHub Actions - Playwright Test Report
Time: [Current timestamp]
✅ TEST START EMAIL SENT SUCCESSFULLY
═══════════════════════════════════════════════════════════════

📋 TEST EXECUTION STARTING...

[... tests run ...]

📋 TEST EXECUTION COMPLETED
═══════════════════════════════════════════════════════════════

📊 Test Results:
   Total Tests: 5
   ✅ Passed: 4
   ❌ Failed: 1
   Pass Rate: 80%

📧 Preparing to send completion email...

═══════════════════════════════════════════════════════════════
📧 SENDING TEST COMPLETION EMAIL
═══════════════════════════════════════════════════════════════
To: recipient@example.com
Suite: GitHub Actions - Playwright Test Report
Total Tests: 5
Passed: 4
Failed: 1
Skipped: 0
Status: ❌ FAILED
📎 Attached: test-report.html
✅ TEST COMPLETION EMAIL SENT SUCCESSFULLY
═══════════════════════════════════════════════════════════════

✅ TEST SUITE COMPLETED SUCCESSFULLY
═══════════════════════════════════════════════════════════════
```

## Configuration Files Involved

### 1. `.env` (Created by GitHub workflow)
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
RECIPIENT_EMAIL=recipient@example.com
TEST_REPORT_TITLE=GitHub Actions - Playwright Test Report
```

### 2. `playwright.config.js`
```javascript
globalSetup: './globalSetup.js',      // Runs before tests → sends START email
globalTeardown: './globalTeardown.js' // Runs after tests → sends END email
```

### 3. `.github/workflows/playwright.yml`
- Creates `.env` from GitHub Secrets
- Runs `npx playwright test`
- globalSetup/globalTeardown automatically triggered

## What Each Email Contains

### START Email
- Subject: `[TEST START] GitHub Actions - Playwright Test Report - [timestamp]`
- Body:
  - Test suite name
  - Start time
  - Test status: "IN PROGRESS"
- Attachment: None

### END Email
- Subject: `[TEST COMPLETE] GitHub Actions - Playwright Test Report - [timestamp]`
- Body:
  - Test summary table:
    - Total tests
    - Passed tests & percentage
    - Failed tests & percentage
    - Skipped tests & percentage
  - Execution details:
    - Test suite name
    - Start & end times
    - Duration (minutes & seconds)
    - Environment
  - Test status: "PASSED" or "FAILED"
- Attachment: `test-report.html` (Full Playwright HTML report)

## Testing Email Functionality Locally

Run tests locally to test email setup:

```bash
# Make sure .env is configured
npm install
npx playwright test --project="Google Chrome"
```

You should see:
1. START email in your inbox immediately
2. END email after tests complete with report attached

## Troubleshooting Email Flow

### Emails not arriving?

1. **Check workflow secrets**:
   - Go to Settings > Secrets and variables > Actions
   - Verify all 3 secrets are set:
     - GMAIL_USER
     - GMAIL_APP_PASSWORD
     - RECIPIENT_EMAIL

2. **Check workflow logs**:
   - Go to Actions > workflow run
   - Expand "Run Playwright tests" step
   - Look for `✅ TEST START EMAIL SENT` or error messages

3. **Check spam folder**:
   - Gmail sometimes marks automated emails as spam
   - Add email to contacts to prevent this

4. **Check .env creation**:
   - Step "Create .env file with email configuration" must succeed
   - If it fails, secrets are not set correctly

### One email missing?

- **START email missing**: Check globalSetup.js ran (look for "📧 SENDING TEST START EMAIL")
- **END email missing**: Check globalTeardown.js ran (look for "📧 SENDING TEST COMPLETION EMAIL")
- **Both missing**: Gmail credentials wrong, check error messages

## GitHub Scheduled Runs

Emails are automatically sent on schedule:

```yaml
# Daily at 10:00 AM IST (04:30 UTC)
- cron: '30 4 * * *'

# Weekly on Monday at 11:00 AM IST (05:30 UTC)  
- cron: '30 5 * * 0'

# Alternate days at 12:00 PM IST (06:30 UTC)
- cron: '30 6 */2 * *'
```

Each scheduled run will send START and END emails with test results.

---

**Summary**: Two emails are automatically sent during test execution:
1. ✅ **START EMAIL** - When globalSetup.js runs (before tests)
2. ✅ **END EMAIL** - When globalTeardown.js runs (after tests) with full report attached
