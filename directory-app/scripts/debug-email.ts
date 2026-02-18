import 'dotenv/config';
import { verifySMTPConnection, sendOTPEmail } from '../src/lib/email';

async function main() {
    console.log('Testing SMTP Connection...');

    // Verify configuration first
    console.log('Environment Variables Check:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '****' : 'MISSING');
    console.log('SMTP_FROM:', process.env.SMTP_FROM);

    const isConnected = await verifySMTPConnection();

    if (isConnected) {
        console.log('SMTP Connection Successful!');
        try {
            console.log('Attempting to send test email to: test@example.com');
            await sendOTPEmail('test@example.com', '123456');
            console.log('Test email sent successfully!');
        } catch (error) {
            console.error('Failed to send test email:', error);
        }
    } else {
        console.error('SMTP Connection Failed!');
    }
}

main();
