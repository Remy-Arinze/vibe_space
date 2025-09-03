import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get('team/:teamId')
  findAllByTeam(@Param('teamId') teamId: string, @GetUser('id') userId: string) {
    return this.tasksService.findAll(teamId, userId);
  }

  @Get('assigned')
  findAssignedToMe(@GetUser('id') userId: string) {
    return this.tasksService.getTasksByAssignee(userId);
  }

  @Get('created')
  findCreatedByMe(@GetUser('id') userId: string) {
    return this.tasksService.getTasksByCreator(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser('id') userId: string,
  ) {
    const updatedTask = await this.tasksService.update(id, updateTaskDto, userId);
    return updatedTask;
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}