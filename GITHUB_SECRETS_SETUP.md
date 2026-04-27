# GitHub Actions SMTP Setup Guide

This guide explains how to configure GitHub secrets for email notifications in your GitHub Actions workflow.

## Step 1: Prepare Gmail App Password

Before adding secrets to GitHub, ensure you have:
1. 2-Factor Authentication enabled on Gmail
2. A 16-character Gmail App Password generated (see [SETUP_GMAIL.md](./SETUP_GMAIL.md))

## Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret** for each of the following:

### Required Secrets to Add:

**Secret 1: GMAIL_USER**
- **Name**: `GMAIL_USER`
- **Value**: `your-email@gmail.com` (your Gmail address)
- Click **Add secret**

**Secret 2: GMAIL_APP_PASSWORD**
- **Name**: `GMAIL_APP_PASSWORD`
- **Value**: `xxxx xxxx xxxx xxxx` (16-character app password, with or without spaces)
- Click **Add secret**

**Secret 3: RECIPIENT_EMAIL**
- **Name**: `RECIPIENT_EMAIL`
- **Value**: `recipient@example.com` (where to send reports)
- Click **Add secret**

## Step 3: Verify Secrets Are Set

After adding secrets, verify they're listed:
- Go to Settings > Secrets and variables > Actions
- You should see three secrets:
  - ✅ GMAIL_USER
  - ✅ GMAIL_APP_PASSWORD
  - ✅ RECIPIENT_EMAIL

## How It Works

When the workflow runs:

1. ✅ Tests start → **Email sent** with test execution start notification
2. ✅ Tests complete → **Email sent** with:
   - Test summary (passed/failed/skipped)
   - Execution time
   - Pass rate
   - Attached HTML report
3. ✅ Artifact uploaded to GitHub

### Workflow Steps:

```yaml
1. Create .env file with GitHub secrets
   ↓
2. Install dependencies
   ↓
3. Run Playwright tests
   ↓
4. Global setup runs → sends START email
   ↓
5. Tests execute
   ↓
6. Global teardown runs → sends COMPLETION email with report
   ↓
7. Report uploaded as artifact
```

## Testing the Setup

### Option 1: Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Playwright Tests** workflow
3. Click **Run workflow**
4. Watch the run:
   - You should receive a START email immediately
   - After tests complete, you'll receive an END email with the report
   - Check the **Test Report Summary** step for confirmation

### Option 2: Wait for Scheduled Run

The workflow runs on schedule (see `playwright.yml`):
- Daily at 10:00 AM IST (4:30 UTC)
- Weekly Monday at 11:00 AM IST (5:30 UTC)
- Alternate days at 12:00 PM IST (6:30 UTC)

## Troubleshooting

### ❌ "GMAIL_USER not found" Error

**Cause**: GitHub secret not set or misspelled

**Solution**:
1. Go to Settings > Secrets and variables > Actions
2. Verify secret name is exactly `GMAIL_USER`
3. Verify value is correct

### ❌ Emails Not Sending

**Checklist**:
1. All three secrets are set: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `RECIPIENT_EMAIL`
2. App password is correct (16 characters)
3. 2FA is enabled on your Gmail account
4. Check GitHub Actions logs for errors

### ❌ "Invalid credentials" Error

**Cause**: Wrong Gmail app password

**Solution**:
1. Generate a new app password from Google Account
2. Update `GMAIL_APP_PASSWORD` secret in GitHub
3. Re-run the workflow

### ❌ Tests Fail but No Email

Tests will complete even if email fails. To debug:
1. Check workflow logs (Actions tab > specific run > build output)
2. Look for error messages in:
   - "Create .env file" step
   - "Run Playwright tests" step console output

## Viewing Test Results

After workflow completes:

### Option 1: GitHub Actions Artifacts
- Go to Actions tab
- Click on the workflow run
- Scroll down to **Artifacts**
- Download `playwright-report`
- Extract and open `index.html`

### Option 2: Email Report
- Open the email sent after tests complete
- Download the attached `test-report.html`
- Open in your browser

## Best Practices

✅ **Do**:
- Use GitHub secrets for sensitive data
- Rotate app passwords periodically
- Keep `.env` in `.gitignore`
- Use descriptive secret names

❌ **Don't**:
- Commit `.env` file to repository
- Share app password in issues/PRs
- Use regular Gmail password (use app password)
- Commit credentials in workflow files

## Updating Secrets

If you need to change an email address or regenerate the app password:

1. Go to Settings > Secrets and variables > Actions
2. Click the secret you want to update
3. Click **Update secret**
4. Enter new value
5. Click **Update secret**

The next workflow run will use the new values.

## Multiple Recipients

To send to multiple recipients, edit the workflow:

```yaml
- name: Create .env file with email configuration
  env:
    GMAIL_USER: ${{ secrets.GMAIL_USER }}
    GMAIL_APP_PASSWORD: ${{ secrets.GMAIL_APP_PASSWORD }}
  run: |
    echo "GMAIL_USER=$GMAIL_USER" > .env
    echo "GMAIL_APP_PASSWORD=$GMAIL_APP_PASSWORD" >> .env
    echo "RECIPIENT_EMAIL=${{ secrets.RECIPIENT_EMAIL }}" >> .env
    echo "RECIPIENT_EMAIL=${{ secrets.RECIPIENT_EMAIL_2 }}" >> .env
    echo "TEST_REPORT_TITLE=GitHub Actions - Playwright Test Report" >> .env
```

Then add `RECIPIENT_EMAIL_2` as a new secret.

Or modify `globalTeardown.js` to loop through multiple recipients.

## Environment Variables Reference

| Variable | Value | Example |
|----------|-------|---------|
| `GMAIL_USER` | Your Gmail address | `john.doe@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-char app password | `abcd efgh ijkl mnop` |
| `RECIPIENT_EMAIL` | Email to receive reports | `team@example.com` |
| `TEST_REPORT_TITLE` | Custom report title | `CI/CD Test Report` |

## Workflow Status Checks

The workflow will:
- ✅ **Pass** even if email fails (tests are what matter)
- ❌ **Fail** only if tests fail or dependencies can't install
- 📧 **Always attempt** to send emails (with error logging)

Check logs to see email status:
1. Actions tab > specific run
2. Expand the **Run Playwright tests** step
3. Look for `✅ Test Start Email sent` or error messages

---

**Need help?** See:
- [SETUP_GMAIL.md](./SETUP_GMAIL.md) - Gmail configuration
- [README.md](./README.md) - Project overview
- `.github/workflows/playwright.yml` - Workflow definition
