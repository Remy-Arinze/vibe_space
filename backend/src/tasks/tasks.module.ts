import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';
import { EmailService } from 'src/common/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    TeamsModule,
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService,EmailService],
  exports: [TasksService],
})
export class TasksModule {}