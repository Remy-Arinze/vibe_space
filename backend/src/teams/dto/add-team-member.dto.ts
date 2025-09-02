import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TeamRole } from '../entities/team-member.entity';

export class AddTeamMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsEnum(TeamRole)
  role?: TeamRole;
}