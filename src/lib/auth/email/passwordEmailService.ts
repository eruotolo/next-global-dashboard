import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';

import ResetPasswordEmail from '@/lib/email/templates/ResetPasswordEmail';

import type { EmailConfig, EmailSendResult, PasswordResetEmailData } from './types';

class PasswordEmailService {
    private config: EmailConfig | null = null;

    constructor() {
        this.initializeConfig();
    }

    private initializeConfig(): void {
        const apiKey = process.env.BREVO_API_KEY;
        const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM;
        const senderName = process.env.BREVO_SENDER_NAME || 'Chubby Dashboard';

        if (!apiKey) {
            console.error('❌ BREVO_API_KEY not found in environment variables');
            this.config = null;
            return;
        }

        if (!senderEmail) {
            console.error('❌ BREVO_SENDER_EMAIL not found in environment variables');
            this.config = null;
            return;
        }

        this.config = {
            apiKey,
            senderName,
            senderEmail,
        };

        //console.log('✅ Email service initialized with sender:', this.config.senderEmail);
    }

    async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<EmailSendResult> {
        //console.log('📧 Sending email to:', data.userEmail);

        if (!this.config) {
            console.error('❌ Email service not configured');
            return {
                success: false,
                error: 'Email service not configured (missing BREVO_API_KEY)',
            };
        }

        try {
            // Configure Brevo API
            const apiInstance = new brevo.TransactionalEmailsApi();
            apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, this.config.apiKey);

            // Generate HTML email using React-email
            const emailHtml = await render(
                ResetPasswordEmail({
                    userName: data.userName,
                    temporaryPassword: data.temporaryPassword,
                    resetBy: data.resetBy,
                }),
            );

            // Configure and send email
            const sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.subject = 'Contraseña Reseteada - Chubby Dashboard';
            sendSmtpEmail.to = [
                {
                    email: data.userEmail,
                    name: data.userName,
                },
            ];
            sendSmtpEmail.sender = {
                name: this.config.senderName,
                email: this.config.senderEmail,
            };
            sendSmtpEmail.htmlContent = emailHtml;

            //console.log('📧 Email config: FROM', this.config.senderEmail, 'TO', data.userEmail);

            const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
            //console.log('✅ Email sent! Message ID:', response.body?.messageId || 'No ID');

            return { success: true };
        } catch (error) {
            console.error('❌ EMAIL FAILED:', error instanceof Error ? error.message : error);

            // Errores específicos de Brevo
            if (error && typeof error === 'object' && 'body' in error) {
                console.error('❌ Brevo API Error:', JSON.stringify(error.body, null, 2));
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown email error',
            };
        }
    }

    isConfigured(): boolean {
        return this.config !== null;
    }
}

// Export singleton instance
export const passwordEmailService = new PasswordEmailService();
