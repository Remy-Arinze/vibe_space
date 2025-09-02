import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(req: any): Promise<{
        access_token: string;
        user: any;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(resendVerificationDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
}
