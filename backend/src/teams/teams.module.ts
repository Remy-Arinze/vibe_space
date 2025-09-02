import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { UsersModule } from '../users/users.module';
import { EmailService } from 'src/common/services/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember]), UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService,EmailService],
  exports: [TeamsService],
})
export class TeamsModule {}