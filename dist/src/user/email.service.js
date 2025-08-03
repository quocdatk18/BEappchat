"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer = require("nodemailer");
class EmailService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    async sendMail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html,
            });
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map