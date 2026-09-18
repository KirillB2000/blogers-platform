import nodemailer from 'nodemailer'
import { SETTINGS } from '../../../settings/config';
import { injectable } from 'inversify';

@injectable()
export class NodemailerService {
    async sendEmail (
        email: string,
        code: string,
        template: (code: string) => string // эта запись
    ) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASSWORD,
            },
        });

        let info = await transporter.sendMail({
            from: `"Hello! It's our project." <${SETTINGS.EMAIL}>`,
            to: email,
            subject: 'Your code is here',
            html: template(code)
        })

        return info
    } 
}