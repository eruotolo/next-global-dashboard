import nodemailer from 'nodemailer';

export async function sendMail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'no-reply@tudominio.com',
            to,
            subject,
            html,
        });
        console.log('Correo enviado:', info.messageId);
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error; // Relanza el error para que `recoveryAccount` lo capture
    }
}
