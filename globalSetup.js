import EmailService from './utils/emailService.js';

const globalSetup = async () => {
  console.log('\n\n' + '█'.repeat(60));
  console.log('🚀 PLAYWRIGHT TEST SUITE STARTING');
  console.log('█'.repeat(60));
  console.log('📧 Initializing email notification service...\n');
  
  try {
    const emailService = new EmailService();
    
    // Verify environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.RECIPIENT_EMAIL) {
      console.warn('⚠️ Warning: Missing email configuration');
      console.warn('   - GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Missing');
      console.warn('   - GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing');
      console.warn('   - RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL ? '✅ Set' : '❌ Missing');
      console.warn('\nPlease check your .env file or GitHub Secrets configuration\n');
    }

    // Send test start email
    const emailSent = await emailService.sendTestStartEmail();
    
    if (emailSent) {
      console.log('✅ Test notifications are enabled');
    } else {
      console.warn('⚠️ Email service encountered an error but tests will continue');
    }

    // Store email service in global state for teardown
    process.emailService = emailService;
    
    console.log('\n' + '█'.repeat(60));
    console.log('📋 TEST EXECUTION STARTING...');
    console.log('█'.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Global setup error:', error.message);
    console.error('Tests will continue but email notifications may not work');
  }
};

export default globalSetup;
