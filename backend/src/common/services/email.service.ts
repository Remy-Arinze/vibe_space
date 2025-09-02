// email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST', 'smtp.mailtrap.io'),
      port: Number(this.configService.get('MAIL_PORT', 2525)),
      auth: {
        user: this.configService.get('MAIL_USER', ''),
        pass: this.configService.get('MAIL_PASS', ''),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string, from?: string) {
    try {
      await this.transporter.sendMail({
        from: from || this.configService.get('MAIL_FROM', 'noreply@vibespaceteam.com'),
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error('Failed to send email', err);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
