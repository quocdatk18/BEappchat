export declare class EmailService {
    private transporter;
    sendMail(to: string, subject: string, html: string): Promise<void>;
}
