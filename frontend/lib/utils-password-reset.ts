import nodemailer from 'nodemailer';

/**
 * Send a password reset email to a user
 */
export async function sendPasswordResetEmail(
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
      subject: 'Password Reset - Coficab FPS System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset - Coficab FPS System</h2>
          <p>Hello ${name},</p>
          <p>Your password has been reset as requested.</p>
          <p>Here are your new login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>New Password:</strong> ${password}</p>
          </div>
          <p>Please login and change your password as soon as possible.</p>
          <p>If you did not request this password reset, please contact your administrator immediately.</p>
          <p>Best regards,<br>Coficab FPS Team</p>
        </div>
      `,
    };

    // Comment out actual email sending in development
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
    } else {
      // Log the email info in development environment
      console.log('Password reset email would be sent in production:');
      console.log('To:', email);
      console.log('Subject:', mailOptions.subject);
      console.log('New Password:', password);
    }

    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
