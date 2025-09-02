import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST', 'smtp.mailtrap.io'),
      port: this.configService.get('MAIL_PORT', 2525),
      auth: {
        user: this.configService.get('MAIL_USER', ''),
        pass: this.configService.get('MAIL_PASS', ''),
      },
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified. Please verify your email first.');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Generate verification token
    const verificationToken = uuidv4();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // Token valid for 24 hours

    // Create user with verification token
    const user = await this.usersService.create({
      ...createUserDto,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email
    await this.sendVerificationEmail(user.email, verificationToken);

    const { password: _, verificationToken: __, verificationTokenExpiry: ___, ...result } = user;
    return result;
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.verificationTokenExpiry < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    // Update user as verified
    await this.usersService.markEmailAsVerified(user.id);

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new verification token
    const verificationToken = uuidv4();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Update user with new verification token
    await this.usersService.updateVerificationToken(user.id, verificationToken, verificationTokenExpiry);

    // Send verification email
    await this.sendVerificationEmail(email, verificationToken);

    return { message: 'Verification email sent' };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM', 'noreply@vibespaceteam.com'),
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering with Vibe Space. Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  }
}