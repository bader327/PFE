import nodemailer from 'nodemailer';

/**
 * Generate a random strong password
 * @returns A random password with 8-10 characters including symbols
 */
export function generatePassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_-+={}[]|:;<>,.?/~';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  const length = Math.floor(Math.random() * 3) + 8; // Random length between 8-10
  
  // Ensure at least one of each type
  let password = 
    lowercase.charAt(Math.floor(Math.random() * lowercase.length)) +
    uppercase.charAt(Math.floor(Math.random() * uppercase.length)) +
    numbers.charAt(Math.floor(Math.random() * numbers.length)) +
    symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Send a welcome email to a new user with their credentials
 */
export async function sendWelcomeEmail(
  email: string, 
  name: string,
  password: string
): Promise<boolean> {
  try {
    // In production, use your actual SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASSWORD || 'password',
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@coficab.com',
      to: email,
      subject: 'Welcome to Coficab FPS System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Coficab FPS System</h2>
          <p>Hello ${name},</p>
          <p>Your account has been created in the Coficab FPS System.</p>
          <p>Here are your login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p>Please login and change your password as soon as possible.</p>
          <p>If you have any questions, please contact your administrator.</p>
          <p>Best regards,<br>Coficab FPS Team</p>
        </div>
      `,
    };

    // Comment out actual email sending in development
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
    } else {
      // Log the email info in development environment
      console.log('Email would be sent in production:');
      console.log('To:', email);
      console.log('Subject:', mailOptions.subject);
      console.log('Password:', password);
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

import { sendPasswordResetEmail } from './utils-password-reset';
export { sendPasswordResetEmail };

/**
 * Role-based redirect helper
 */
export function getRedirectPathForRole(role: string): string {
  switch (role) {
    case 'SUPERADMIN':
      return '/dashboard';
    case 'QUALITICIEN':
      return '/niveauligne';
    case 'CHEF_ATELIER':
      return '/dashboard';
    case 'NORMAL_USER':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}
