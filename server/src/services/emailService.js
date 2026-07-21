const transporter = require("../config/mail");

const generateVerificationEmailHTML = (otp,name) => {
    const displayName = name && name.trim() ? name.trim() : "there";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email - Shortlist AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px;">
          
          <!-- Logo / Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #f4f4f5;">
              <span style="font-size: 20px; font-weight: 700; color: #18181b; letter-spacing: -0.5px;">Shortlist AI</span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding-top: 24px;">
              <h1 style="font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 12px 0;">Verify your email address</h1>
              
              <p style="font-size:15px;line-height:1.5;color:#18181b;margin:0 0 16px 0;">
                Hi ${displayName},
              </p>

              <p style="font-size:15px;line-height:1.6;color:#52525b;margin:0 0 24px 0;">
                Welcome to Shortlist AI. Use the verification code below to verify your email address and activate your account.
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #18181b;">${otp}</span>
              </div>

              <p style="font-size: 14px; color: #71717a; margin: 0 0 24px 0;">
                This code will expire in <strong>10 minutes</strong>.
              </p>

              <p style="font-size: 13px; color: #a1a1aa; margin: 0; line-height: 1.4;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #f4f4f5; margin-top: 24px; font-size: 12px; color: #a1a1aa; text-align: center; line-height: 1.5;">
              &copy; ${new Date().getFullYear()} Shortlist AI. All rights reserved.<br>
              Smarter hiring powered by AI.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const generateForgotPasswordEmailHTML = (otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password - Shortlist AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px;">
          
          <!-- Logo / Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #f4f4f5;">
              <span style="font-size: 20px; font-weight: 700; color: #18181b; letter-spacing: -0.5px;">Shortlist AI</span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding-top: 24px;">
              <h1 style="font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 12px 0;">Reset your password</h1>
              
              <p style="font-size: 15px; line-height: 1.5; color: #52525b; margin: 0 0 24px 0;">
                A request was made to reset the password for your Shortlist AI account. Use the verification code below to continue:
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #18181b;">${otp}</span>
              </div>

              <p style="font-size: 14px; color: #71717a; margin: 0 0 24px 0;">
                This code will expire in <strong>10 minutes</strong>.
              </p>

              <p style="font-size: 13px; color: #a1a1aa; margin: 0; line-height: 1.4;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #f4f4f5; margin-top: 24px; font-size: 12px; color: #a1a1aa; text-align: center; line-height: 1.5;">
              &copy; ${new Date().getFullYear()} Shortlist AI. All rights reserved.<br>
              Smarter hiring powered by AI.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const generateWelcomeEmailHTML = (name) => {
    const displayName = name && name.trim() ? name.trim() : "there";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Shortlist AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px;">
          
          <!-- Logo / Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #f4f4f5;">
              <span style="font-size: 20px; font-weight: 700; color: #18181b; letter-spacing: -0.5px;">Shortlist AI</span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding-top: 24px;">
              <h1 style="font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 16px 0;">
                Welcome to Shortlist AI 🚀
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #18181b; margin: 0 0 16px 0;">
                Hi ${displayName},
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #52525b; margin: 0 0 24px 0;">
                Your email has been successfully verified and your account is now ready to use. Shortlist AI helps recruiters simplify hiring by intelligently analyzing resumes, ranking candidates, and managing recruitment workflows in one place.
              </p>

              <!-- Next Steps Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="font-size: 15px; font-weight: 600; color: #18181b; margin: 0 0 14px 0;">
                  What's next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
                  <li style="margin-bottom: 6px;">Create and manage job postings</li>
                  <li style="margin-bottom: 6px;">Upload candidate resumes</li>
                  <li style="margin-bottom: 6px;">Get AI-powered resume analysis and candidate rankings</li>
                  <li>Track applicants from a centralized dashboard</li>
                </ul>
              </div>

              <p style="font-size: 14px; color: #71717a; line-height: 1.6; margin: 0;">
                Thanks for choosing Shortlist AI. We're excited to be part of your hiring journey.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #f4f4f5; margin-top: 24px; font-size: 12px; color: #a1a1aa; text-align: center; line-height: 1.5;">
              &copy; ${new Date().getFullYear()} Shortlist AI. All rights reserved.<br>
              Smarter hiring powered by AI.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

class EmailService {

    async sendEmailVerificationOTP(email, otp, name) {
        const mailOptions = {
            from: process.env.MAIL_FROM || '"Shortlist AI" <no-reply@shortlistai.com>',
            to: email,
            subject: "Verify your email - Shortlist AI",
            html: generateVerificationEmailHTML(otp,name)
        };

        await transporter.sendMail(mailOptions);
    }

    async sendForgotPasswordOTP(email, otp) {
        const mailOptions = {
            from: process.env.MAIL_FROM || '"Shortlist AI" <no-reply@shortlistai.com>',
            to: email,
            subject: "Reset your password - Shortlist AI",
            html: generateForgotPasswordEmailHTML(otp)
        };

        await transporter.sendMail(mailOptions);
    }

    async sendWelcomeEmail(email, name) {
        const mailOptions = {
            from: process.env.MAIL_FROM || '"Shortlist AI" <no-reply@shortlistai.com>',
            to: email,
            subject: "Welcome to Shortlist AI!",
            html: generateWelcomeEmailHTML(name)
        };

        await transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();