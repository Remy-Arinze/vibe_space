import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private transporter;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        username: string;
        isEmailVerified: boolean;
        teamMembers: import("../teams/entities/team-member.entity").TeamMember[];
        createdTasks: import("../tasks/entities/task.entity").Task[];
        assignedTasks: import("../tasks/entities/task.entity").Task[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    private sendVerificationEmail;
}
