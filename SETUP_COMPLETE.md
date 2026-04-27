# Complete Email Notification Setup Guide

## ✅ What's Been Configured

Your Playwright test suite now has **automatic email notifications** that send:

1. **📧 START EMAIL** - When tests begin (via `globalSetup.js`)
2. **📧 END EMAIL** - When tests complete with full test report attached (via `globalTeardown.js`)

## 🚀 Quick Start

### Step 1: Configure Gmail Account (One-time Setup)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate an [App Password](https://myaccount.google.com/apppasswords)
4. Copy the 16-character app password

**See [SETUP_GMAIL.md](./SETUP_GMAIL.md) for detailed instructions**

### Step 2: Add GitHub Secrets (One-time Setup)
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add 3 new secrets:
   - `GMAIL_USER` = your-email@gmail.com
   - `GMAIL_APP_PASSWORD` = your 16-char password
   - `RECIPIENT_EMAIL` = where-to-send-reports@example.com

**See [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) for detailed instructions**

### Step 3: Test Locally (Optional)
```bash
# Configure .env file locally
echo "GMAIL_USER=your-email@gmail.com" > .env
echo "GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx" >> .env
echo "RECIPIENT_EMAIL=recipient@example.com" >> .env
echo "TEST_REPORT_TITLE=Playwright Test Report" >> .env

# Run tests - emails will be sent
npx playwright test
```

### Step 4: Enable in GitHub Actions
✅ Already done! GitHub Actions workflow is configured to:
- Create `.env` from GitHub Secrets
- Run tests
- Automatically send START and END emails

## 📧 Email Details

### START Email
- **When**: Before tests begin (globalSetup runs)
- **To**: Your configured recipient email
- **Subject**: `[TEST START] GitHub Actions - Playwright Test Report - [timestamp]`
- **Contains**:
  - Test suite name
  - Start timestamp
  - Status: IN PROGRESS
  - No attachment

### END Email
- **When**: After all tests complete (globalTeardown runs)
- **To**: Your configured recipient email
- **Subject**: `[TEST COMPLETE] GitHub Actions - Playwright Test Report - [timestamp]`
- **Contains**:
  - Test summary table:
    - Total tests run
    - Passed tests & pass rate
    - Failed tests & failure rate
    - Skipped tests
  - Execution details:
    - Suite name
    - Start & end times
    - Total duration
  - Status: PASSED or FAILED
  - **Attachment**: `test-report.html` (Full Playwright HTML report)

## 📁 Files Created/Modified

### New Files
- `utils/emailService.js` - Email service with Gmail SMTP
- `globalSetup.js` - Sends START email before tests
- `globalTeardown.js` - Sends END email after tests with report
- `.env` - Local configuration (git-ignored)
- `.env.example` - Configuration template
- `SETUP_GMAIL.md` - Gmail setup guide
- `GITHUB_SECRETS_SETUP.md` - GitHub secrets setup guide
- `EMAIL_FLOW.md` - Email workflow documentation

### Modified Files
- `playwright.config.js` - Added globalSetup/globalTeardown
- `package.json` - Added nodemailer & dotenv dependencies
- `.github/workflows/playwright.yml` - Integrated email service
- `.gitignore` - Protects .env file

## 🔄 How It Works

### Local Execution
```
npm install                              ✅ Installs nodemailer & dotenv
    ↓
.env loaded by dotenv
    ↓
npx playwright test                      Runs tests
    ↓
globalSetup.js                           📧 Sends START email
    ↓
Tests Execute
    ↓
globalTeardown.js                        📧 Sends END email with report
    ↓
HTML report generated                    ✅ Available in playwright-report/
```

### GitHub Actions Execution
```
Workflow Triggered (push/PR/schedule)
    ↓
Create .env file                         (from GitHub Secrets)
    ↓
Install dependencies
    ↓
Install Playwright
    ↓
npx playwright test
    ↓
globalSetup.js                           📧 Sends START email
    ↓
Tests Execute
    ↓
globalTeardown.js                        📧 Sends END email with report
    ↓
Upload HTML report as artifact           ✅ Download from Actions
```

## 🔐 Security

- ✅ `.env` is in `.gitignore` - never committed
- ✅ Credentials stored in GitHub Secrets - encrypted
- ✅ App passwords used instead of regular passwords
- ✅ Secure SMTP connection (Gmail TLS)
- ✅ No sensitive data in logs

## 📋 Workflow Triggers

Emails are sent on:

### Manual Triggers
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch
- Manual run from Actions tab

### Scheduled Runs (via cron)
- Daily: 10:00 AM IST (04:30 UTC)
- Weekly: Monday 11:00 AM IST (05:30 UTC)
- Every 2 days: 12:00 PM IST (06:30 UTC)

Each run sends START and END emails with test results.

## 🔍 Viewing Email Logs in GitHub Actions

1. Go to **Actions** tab
2. Click on the workflow run
3. Expand **"Run Playwright tests"** step
4. Look for:
   - `✅ TEST START EMAIL SENT SUCCESSFULLY`
   - `✅ TEST COMPLETION EMAIL SENT SUCCESSFULLY`
5. If emails fail, error messages will show the issue

## ❌ Troubleshooting

### "Email not received" Error
1. ✅ Check GitHub Secrets are set correctly
2. ✅ Check spam/trash folder
3. ✅ Verify recipient email is correct
4. ✅ Check workflow logs for error messages

### "Invalid credentials" Error
1. ✅ Use 16-character **app password** (NOT regular Gmail password)
2. ✅ Verify 2-Step Verification is enabled
3. ✅ Regenerate app password and update GitHub Secret

### "ECONNREFUSED" Error
1. ✅ Check internet connection
2. ✅ Check firewall isn't blocking SMTP
3. ✅ Try from different network

**See [SETUP_GMAIL.md](./SETUP_GMAIL.md) for detailed troubleshooting**

## 🎯 Next Steps

1. **Generate Gmail App Password** → See [SETUP_GMAIL.md](./SETUP_GMAIL.md)
2. **Add GitHub Secrets** → See [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
3. **Test Locally** (optional) → Run `npx playwright test`
4. **Push to GitHub** → Emails will be sent automatically
5. **Check Actions tab** → View workflow logs and email status

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [SETUP_GMAIL.md](./SETUP_GMAIL.md) | How to enable Gmail SMTP |
| [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) | How to add GitHub Secrets |
| [EMAIL_FLOW.md](./EMAIL_FLOW.md) | Email workflow & timeline |
| [README.md](./README.md) | Project overview & running tests |
| [.github/workflows/playwright.yml](./.github/workflows/playwright.yml) | GitHub Actions workflow |

## ✨ Features

✅ Automatic email on test start
✅ Automatic email on test completion
✅ Test report attached to completion email
✅ Professional HTML email templates
✅ Pass/fail rate statistics
✅ Execution time tracking
✅ Support for GitHub Actions scheduled runs
✅ Support for local test execution
✅ Secure credential management
✅ Detailed logging in workflow
✅ Multiple browser support (Chrome, Firefox, Safari)
✅ GitHub Actions artifact upload

## 💡 Tips

- **View test reports**: Open the attached HTML file from completion email
- **View GitHub artifacts**: Go to Actions → Run → Artifacts → playwright-report
- **Custom email templates**: Edit methods in `utils/emailService.js`
- **Add more recipients**: Modify RECIPIENT_EMAIL in workflow
- **Change test schedule**: Edit cron expressions in workflow

---

**Ready to start?** Follow the Quick Start section above! 🚀

For detailed setup: See [SETUP_GMAIL.md](./SETUP_GMAIL.md) and [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
