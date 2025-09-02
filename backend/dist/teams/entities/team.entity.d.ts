import { TeamMember } from './team-member.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class Team {
    id: string;
    name: string;
    description: string;
    members: TeamMember[];
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
