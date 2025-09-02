import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { TeamsService } from '../teams/teams.service';
import { UsersService } from '../users/users.service';
export declare class TasksService {
    private tasksRepository;
    private teamsService;
    private usersService;
    constructor(tasksRepository: Repository<Task>, teamsService: TeamsService, usersService: UsersService);
    create(createTaskDto: CreateTaskDto, creator: User): Promise<Task>;
    findAll(teamId: string, userId: string): Promise<Task[]>;
    findOne(id: string, userId: string): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task>;
    remove(id: string, userId: string): Promise<void>;
    getTasksByAssignee(userId: string): Promise<Task[]>;
    getTasksByCreator(userId: string): Promise<Task[]>;
}
