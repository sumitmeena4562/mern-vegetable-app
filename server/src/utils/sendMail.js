import nodemailer from "nodemailer";

// Transporter will be created inside sendMail to ensure env vars are loaded

// Template Generators
const getTemplate = (type, data) => {
    // Shared Styles
    const mainContainer = `max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;`;
    const headerStyle = `background: linear-gradient(135deg, #16a34a, #15803d); padding: 35px 20px; text-align: center;`;
    const bodyStyle = `padding: 40px 30px; background-color: #ffffff; color: #333333; line-height: 1.6;`;
    const footerStyle = `background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;`;
    const buttonStyle = `display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.4);`;
    const headingStyle = `color: #1e293b; font-size: 24px; font-weight: 700; margin-bottom: 20px; margin-top: 0;`;

    switch (type) {
        case 'OTP':
            return {
                subject: '🔐 Verification Code - AgriConnect',
                html: `
                <div style="background-color: #f1f5f9; padding: 40px 10px;">
                    <div style="${mainContainer}">
                        <div style="${headerStyle}">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">AgriConnect</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Secure Verification</p>
                        </div>
                        <div style="${bodyStyle}">
                            <h2 style="${headingStyle} text-align: center;">Verify Your Identity</h2>
                            <p style="text-align: center; color: #64748b; margin-bottom: 30px;">Use the One-Time Password (OTP) below to verify your mobile number. This code is valid for <strong>10 minutes</strong>.</p>
                            
                            <div style="background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin: 0 auto 30px auto; max-width: 250px;">
                                <span style="font-size: 32px; font-weight: 800; color: #15803d; letter-spacing: 6px; font-family: monospace;">${data.otp}</span>
                            </div>

                            <p style="text-align: center; font-size: 13px; color: #94a3b8;">If you did not request this code, please ignore this email.</p>
                        </div>
                        <div style="${footerStyle}">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} AgriConnect. All rights reserved.</p>
                            <p style="margin: 5px 0 0 0;">Connecting Farmers with Markets</p>
                        </div>
                    </div>
                </div>`
            };
        case 'PASSWORD_RESET_OTP':
            return {
                subject: '🔑 Password Reset OTP - AgriConnect',
                html: `
                <div style="background-color: #f1f5f9; padding: 40px 10px;">
                    <div style="${mainContainer}">
                        <div style="${headerStyle} background: linear-gradient(135deg, #d97706, #b45309);">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">AgriConnect</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Password Reset Request</p>
                        </div>
                        <div style="${bodyStyle}">
                            <h2 style="${headingStyle} text-align: center;">Reset Your Password</h2>
                            <p style="text-align: center; color: #64748b; margin-bottom: 30px;">We received a request to reset your password. Use the OTP below to proceed.</p>
                            
                            <div style="background: #fffbeb; border: 2px dashed #d97706; border-radius: 12px; padding: 20px; text-align: center; margin: 0 auto 30px auto; max-width: 250px;">
                                <span style="font-size: 32px; font-weight: 800; color: #b45309; letter-spacing: 6px; font-family: monospace;">${data.otp}</span>
                            </div>

                            <p style="text-align: center; font-size: 13px; color: #94a3b8;">If you did not request a password reset, please secure your account immediately.</p>
                        </div>
                        <div style="${footerStyle}">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} AgriConnect. Security Alert.</p>
                        </div>
                    </div>
                </div>`
            };
        case 'PASSWORD_RESET_SUCCESS':
            return {
                subject: '✅ Password Changed - AgriConnect',
                html: `
                <div style="background-color: #f1f5f9; padding: 40px 10px;">
                    <div style="${mainContainer}">
                        <div style="${headerStyle}">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">AgriConnect</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Security Notification</p>
                        </div>
                        <div style="${bodyStyle}">
                            <h2 style="${headingStyle}">Password Changed</h2>
                            <p>Hello <strong>${data.name}</strong>,</p>
                            <p style="color: #475569;">Your AgriConnect account password was successfully changed just now.</p>
                            
                            <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; color: #0c4a6e; font-size: 14px;">
                                If you did not make this change, please contact support immediately to secure your account.
                            </div>

                            <p>You can now login with your new password.</p>
                            <div style="text-align: center;">
                                <a href="${process.env.CLIENT_URL}/login" style="${buttonStyle}">Login Now</a>
                            </div>
                        </div>
                        <div style="${footerStyle}">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} AgriConnect. All rights reserved.</p>
                        </div>
                    </div>
                </div>`
            };

        case 'WELCOME':
            return {
                subject: `🌱 Welcome to AgriConnect, ${data.name}!`,
                html: `
                <div style="background-color: #f1f5f9; padding: 40px 10px;">
                    <div style="${mainContainer}">
                        <div style="${headerStyle}">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">AgriConnect</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Welcome to the Family</p>
                        </div>
                        <div style="${bodyStyle}">
                            <h2 style="${headingStyle}">Hello, ${data.name}! 👋</h2>
                            <p style="color: #475569; margin-bottom: 20px;">We are thrilled to have you onboard as a <strong>${data.role}</strong>. Your account has been successfully created and is ready to use.</p>
                            
                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #16a34a;">
                                <p style="margin: 5px 0; color: #334155;"><strong>📱 Mobile:</strong> ${data.mobile}</p>
                                <p style="margin: 5px 0; color: #334155;"><strong>📍 Location:</strong> ${data.location || 'India'}</p>
                                <p style="margin: 5px 0; color: #334155;"><strong>📅 Joined:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>

                            <p style="color: #475569; margin-bottom: 30px;">AgriConnect empowers you with direct market access, real-time rates, and a thriving community. Let's grow together!</p>

                            <div style="text-align: center;">
                                <a href="${process.env.CLIENT_URL}/login" style="${buttonStyle}">Access Your Dashboard</a>
                            </div>
                        </div>
                        <div style="${footerStyle}">
                            <p style="margin: 0 0 10px 0;">Need help? Contact our support team.</p>
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} AgriConnect. All rights reserved.</p>
                        </div>
                    </div>
                </div>`
            };

        default:
            throw new Error(`Invalid Email Template Type: ${type}`);
    }
};

/**
 * Send Dynamic Email
 * @param {string} email - Recipient
 * @param {string} type - 'OTP' | 'WELCOME'
 * @param {object} data - Dynamic data for template
 */
export const sendMail = async (email, type, data) => {
    try {
        const template = getTemplate(type, data);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"AgriConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 [Email Service] Email sent successfully! Type: [${type}], MessageID: ${info.messageId}`);
        return { success: true };

    } catch (error) {
        console.error('❌ Email Sending Failed:', error.message);

        // Fallback for Development: Log the email content if SMTP fails
        if (process.env.NODE_ENV !== 'production') {
            const template = getTemplate(type, data);
            console.log("\n⚠️ [DEV FALLBACK] SMTP Error. Simulator Output:");
            console.log("---------------------------------------------------");
            console.log(`To: ${email}`);
            console.log(`Subject: ${template.subject}`);
            console.log(`Body Snippet: ${template.html.substring(0, 100)}...`);
            console.log("---------------------------------------------------\n");
            return { success: true, mocked: true };
        }

        return { success: false, error: error.message };
    }
};