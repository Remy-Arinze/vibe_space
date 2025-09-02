import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, user: User): Promise<import("./entities/task.entity").Task>;
    findAllByTeam(teamId: string, userId: string): Promise<import("./entities/task.entity").Task[]>;
    findAssignedToMe(userId: string): Promise<import("./entities/task.entity").Task[]>;
    findCreatedByMe(userId: string): Promise<import("./entities/task.entity").Task[]>;
    findOne(id: string, userId: string): Promise<import("./entities/task.entity").Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<import("./entities/task.entity").Task>;
    remove(id: string, userId: string): Promise<void>;
}
