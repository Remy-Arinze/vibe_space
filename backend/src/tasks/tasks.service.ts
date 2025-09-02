import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { TeamsService } from '../teams/teams.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private teamsService: TeamsService,
    private usersService: UsersService,
  ) {}

async create(createTaskDto: CreateTaskDto, creator: User): Promise<Task> {
  // Check if user is a member of the team
  const isMember = await this.teamsService.isUserTeamMember(createTaskDto.teamId, creator.id);
  if (!isMember) {
    throw new ForbiddenException('You must be a team member to create tasks');
  }

  // Check if assignee exists and is a team member
  if (createTaskDto.assigneeId) {
    const assignee = await this.usersService.findOne(createTaskDto.assigneeId);
    const isAssigneeMember = await this.teamsService.isUserTeamMember(
      createTaskDto.teamId,
      assignee.id,
    );
    if (!isAssigneeMember) {
      throw new ForbiddenException('Assignee must be a team member');
    }
  }

  const task = this.tasksRepository.create({
    ...createTaskDto,
    creator,
    creatorId: creator.id,
  });

  return this.tasksRepository.save(task);
}

 async findAll(teamId: string, userId: string): Promise<Task[]> {
  const isMember = await this.teamsService.isUserTeamMember(teamId, userId);
  if (!isMember) {
    throw new ForbiddenException('You must be a team member to view tasks');
  }

  return this.tasksRepository.find({
    where: { teamId },
    relations: ['creator', 'assignee'],
  });
}

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['creator', 'assignee', 'team'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user is a member of the team
    const isMember = await this.teamsService.isUserTeamMember(userId, task.teamId);
    if (!isMember) {
      throw new ForbiddenException('You must be a team member to view this task');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);

    // Check if assignee exists and is a team member
    if (updateTaskDto.assigneeId) {
      const assignee = await this.usersService.findOne(updateTaskDto.assigneeId);
      const isAssigneeMember = await this.teamsService.isUserTeamMember(
        assignee.id,
        task.teamId,
      );
      if (!isAssigneeMember) {
        throw new ForbiddenException('Assignee must be a team member');
      }
    }

    // Update task
    const updatedTask = this.tasksRepository.merge(task, updateTaskDto);
    return this.tasksRepository.save(updatedTask);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);

    // Check if user is a team admin or the creator of the task
    const isAdmin = await this.teamsService.isUserTeamAdmin(userId, task.teamId);
    if (!isAdmin && task.creatorId !== userId) {
      throw new ForbiddenException('Only task creators or team admins can delete tasks');
    }

    await this.tasksRepository.remove(task);
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assigneeId: userId },
      relations: ['team', 'creator'],
    });
  }

  async getTasksByCreator(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { creatorId: userId },
      relations: ['team', 'assignee'],
    });
  }
}