# Gmail SMTP Setup Guide

This guide will help you configure Gmail SMTP for sending test execution reports.

## Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on **"2-Step Verification"** in the left sidebar
3. Follow the prompts to enable it
4. You'll need to verify with your phone

## Step 2: Generate Gmail App Password

1. After enabling 2FA, visit [App Passwords](https://myaccount.google.com/apppasswords)
2. Select:
   - **App**: "Mail"
   - **Device**: "Windows Computer" (or your OS - it doesn't matter)
3. Click **"Generate"**
4. Google will show you a 16-character password (without spaces)
5. **Copy this password** - you'll use it in the next step

**⚠️ Important**: This is NOT your regular Gmail password. Always use this app-specific password in your `.env` file.

## Step 3: Configure .env File

1. Open the `.env` file in the project root
2. Update the following variables:

```env
GMAIL_USER=your-actual-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
RECIPIENT_EMAIL=where-to-send-reports@gmail.com
TEST_REPORT_TITLE=Playwright Test Report
```

**Example:**
```env
GMAIL_USER=john.doe@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
RECIPIENT_EMAIL=john.doe@gmail.com
TEST_REPORT_TITLE=OrangeHRM Login Tests
```

## Step 4: Test Configuration

Run the tests with verbose logging:

```bash
npx playwright test --reporter=list
```

Watch the console for email confirmation messages:
```
✅ Test Start Email sent:
✅ Test End Email sent:
```

## Troubleshooting

### ❌ "Username and password not accepted" Error

**Cause**: Wrong app password or using your regular Gmail password

**Solution**:
- Use the 16-character **app password**, NOT your Gmail password
- Don't include spaces in the app password in `.env`
- Make sure you copied it correctly from Google

### ❌ "The email account that you tried to reach does not exist"

**Cause**: Wrong email address in `RECIPIENT_EMAIL`

**Solution**:
- Verify the email address is correct
- Use a valid Gmail address or any valid email provider

### ❌ "connect ECONNREFUSED" Error

**Cause**: Network/firewall issue or Gmail SMTP is blocked

**Solution**:
- Check your internet connection
- Check if your firewall blocks SMTP (port 587)
- Try from a different network
- Make sure 2FA is enabled before generating app password

### ❌ No email received

**Checklist**:
1. Check spam/trash folder
2. Verify `RECIPIENT_EMAIL` is correct
3. Check console for error messages
4. Verify `.env` file is in project root
5. Run `npm install` again if just updated

## Security Best Practices

1. **Never commit `.env`** - It's in `.gitignore` by default
2. **Use app passwords** - Never use your actual Gmail password
3. **Rotate credentials** - Regenerate app password if compromised
4. **Use environment variables in CI/CD** - Don't hardcode passwords
5. **Delete unused app passwords** - Remove from Google Account > Security > App passwords

## Environment Variables in CI/CD

### GitHub Actions

Add to repository secrets (Settings > Secrets and variables > Actions):
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `RECIPIENT_EMAIL`

Then create `.env` in workflow:

```yaml
- name: Create .env file
  run: |
    echo "GMAIL_USER=${{ secrets.GMAIL_USER }}" > .env
    echo "GMAIL_APP_PASSWORD=${{ secrets.GMAIL_APP_PASSWORD }}" >> .env
    echo "RECIPIENT_EMAIL=${{ secrets.RECIPIENT_EMAIL }}" >> .env
    echo "TEST_REPORT_TITLE=GitHub Actions Test Report" >> .env
```

### Azure DevOps

Add variables in Pipeline settings and create `.env`:

```yaml
- script: |
    echo "GMAIL_USER=$(GMAIL_USER)" > .env
    echo "GMAIL_APP_PASSWORD=$(GMAIL_APP_PASSWORD)" >> .env
    echo "RECIPIENT_EMAIL=$(RECIPIENT_EMAIL)" >> .env
    echo "TEST_REPORT_TITLE=Azure DevOps Test Report" >> .env
  displayName: 'Create .env file'
```

## Multiple Recipients

To send to multiple recipients, update `globalTeardown.js`:

```javascript
const emailService = new EmailService();
const recipients = [
  'user1@example.com',
  'user2@example.com',
  'team@example.com'
];

for (const recipient of recipients) {
  process.env.RECIPIENT_EMAIL = recipient;
  await emailService.sendTestEndEmail(testResults);
}
```

Or modify `emailService.js` to accept an array of recipients.

## Tips & Tricks

- **Test without running tests**: Comment out `globalSetup`/`globalTeardown` in `playwright.config.js`
- **Custom email templates**: Edit email body methods in `utils/emailService.js`
- **Add more metrics**: Parse additional data in `globalTeardown.js`
- **Change sender name**: Update `from` field in `emailService.js`

---

**Questions?** Check the main [README.md](./README.md) for more information about running tests.
