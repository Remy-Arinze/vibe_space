import { TaskStatus } from '../entities/task.entity';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string;
}
