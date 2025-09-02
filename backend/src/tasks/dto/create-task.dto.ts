import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}