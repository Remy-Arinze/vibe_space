import { IsNotEmpty, IsEnum } from 'class-validator';
import { TeamRole } from '../entities/team-member.entity';

export class UpdateTeamMemberRoleDto {
  @IsNotEmpty()
  @IsEnum(TeamRole)
  role: TeamRole;
}