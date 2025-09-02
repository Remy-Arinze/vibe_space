import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';
export declare enum TeamRole {
    ADMIN = "Admin",
    MEMBER = "Member"
}
export declare class TeamMember {
    id: string;
    role: TeamRole;
    user: User;
    userId: string;
    team: Team;
    teamId: string;
    createdAt: Date;
    updatedAt: Date;
}
