import { TeamMember } from '../../teams/entities/team-member.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class User {
    id: string;
    email: string;
    username: string;
    password: string;
    isEmailVerified: boolean;
    verificationToken: string;
    verificationTokenExpiry: Date;
    teamMembers: TeamMember[];
    createdTasks: Task[];
    assignedTasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
