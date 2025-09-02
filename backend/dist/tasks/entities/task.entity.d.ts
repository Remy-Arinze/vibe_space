import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';
export declare enum TaskStatus {
    TODO = "To Do",
    IN_PROGRESS = "In Progress",
    DONE = "Done"
}
export declare class Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    creator: User;
    creatorId: string;
    assignee: User;
    assigneeId: string;
    team: Team;
    teamId: string;
    createdAt: Date;
    updatedAt: Date;
}
