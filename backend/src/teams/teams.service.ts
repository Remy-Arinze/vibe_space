import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember, TeamRole } from './entities/team-member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMembersRepository: Repository<TeamMember>,
    private usersService: UsersService,
  ) {}

  async create(createTeamDto: CreateTeamDto, user: User): Promise<Team> {
    // Create the team
    const team = this.teamsRepository.create(createTeamDto);
    const savedTeam = await this.teamsRepository.save(team);

    // Add the creator as an admin
    const teamMember = this.teamMembersRepository.create({
      team: savedTeam,
      teamId: savedTeam.id,
      user,
      userId: user.id,
      role: TeamRole.ADMIN,
    });
    await this.teamMembersRepository.save(teamMember);

    return savedTeam;
  }

  async findAll(userId: string): Promise<Team[]> {
    // Find all teams where the user is a member
    const teamMembers = await this.teamMembersRepository.find({
      where: { userId },
      relations: ['team'],
    });

    return teamMembers.map(member => member.team);
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['members', 'members.user', 'tasks'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, userId: string): Promise<Team> {
    // Check if team exists
    const team = await this.findOne(id);

    // Check if user is an admin of the team
    await this.verifyUserIsTeamAdmin(id, userId);

    // Update team
    Object.assign(team, updateTeamDto);
    return this.teamsRepository.save(team);
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check if team exists
    const team = await this.findOne(id);

    // Check if user is an admin of the team
    await this.verifyUserIsTeamAdmin(id, userId);

    // Delete team
    await this.teamsRepository.remove(team);
  }

  async addMember(teamId: string, addTeamMemberDto: AddTeamMemberDto, userId: string): Promise<TeamMember> {
    // Check if team exists
    const team = await this.findOne(teamId);

    // Check if user is an admin of the team
    await this.verifyUserIsTeamAdmin(teamId, userId);

    // Check if user to add exists
    const userToAdd = await this.usersService.findByEmail(addTeamMemberDto.email);
    if (!userToAdd) {
      throw new NotFoundException(`User with email ${addTeamMemberDto.email} not found`);
    }

    // Check if user is already a member of the team
    const existingMember = await this.teamMembersRepository.findOne({
      where: { teamId, userId: userToAdd.id },
    });

    if (existingMember) {
      throw new BadRequestException(`User is already a member of this team`);
    }

    // Add user to team
    const teamMember = this.teamMembersRepository.create({
      team,
      teamId,
      user: userToAdd,
      userId: userToAdd.id,
      role: addTeamMemberDto.role || TeamRole.MEMBER,
    });

    return this.teamMembersRepository.save(teamMember);
  }

  async removeMember(teamId: string, memberUserId: string, requestingUserId: string): Promise<void> {
    // Check if team exists
    await this.findOne(teamId);

    // Check if user is an admin of the team or removing themselves
    if (memberUserId !== requestingUserId) {
      await this.verifyUserIsTeamAdmin(teamId, requestingUserId);
    }

    // Check if member exists
    const teamMember = await this.teamMembersRepository.findOne({
      where: { teamId, userId: memberUserId },
    });

    if (!teamMember) {
      throw new NotFoundException(`User is not a member of this team`);
    }

    // Prevent removing the last admin
    if (teamMember.role === TeamRole.ADMIN) {
      const adminCount = await this.teamMembersRepository.count({
        where: { teamId, role: TeamRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(`Cannot remove the last admin from the team`);
      }
    }

    // Remove member
    await this.teamMembersRepository.remove(teamMember);
  }

  async updateMemberRole(teamId: string, memberUserId: string, role: TeamRole, requestingUserId: string): Promise<TeamMember> {
    // Check if team exists
    await this.findOne(teamId);

    // Check if user is an admin of the team
    await this.verifyUserIsTeamAdmin(teamId, requestingUserId);

    // Check if member exists
    const teamMember = await this.teamMembersRepository.findOne({
      where: { teamId, userId: memberUserId },
    });

    if (!teamMember) {
      throw new NotFoundException(`User is not a member of this team`);
    }

    // Prevent demoting the last admin
    if (teamMember.role === TeamRole.ADMIN && role === TeamRole.MEMBER) {
      const adminCount = await this.teamMembersRepository.count({
        where: { teamId, role: TeamRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(`Cannot demote the last admin of the team`);
      }
    }

    // Update role
    teamMember.role = role;
    return this.teamMembersRepository.save(teamMember);
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return this.teamMembersRepository.find({
      where: { teamId },
      relations: ['user'],
    });
  }

  async getUserTeamRole(teamId: string, userId: string): Promise<TeamRole | null> {
    const teamMember = await this.teamMembersRepository.findOne({
      where: { teamId, userId },
    });

    return teamMember ? teamMember.role : null;
  }

  async isUserTeamMember(teamId: string, userId: string): Promise<boolean> {
    const count = await this.teamMembersRepository.count({
      where: { teamId, userId },
    });

    return count > 0;
  }

  async isUserTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const teamMember = await this.teamMembersRepository.findOne({
      where: { teamId, userId },
    });

    return teamMember?.role === TeamRole.ADMIN;
  }

  async verifyUserIsTeamMember(teamId: string, userId: string): Promise<void> {
    const isMember = await this.isUserTeamMember(teamId, userId);
    if (!isMember) {
      throw new ForbiddenException(`You are not a member of this team`);
    }
  }

  async verifyUserIsTeamAdmin(teamId: string, userId: string): Promise<void> {
    const isAdmin = await this.isUserTeamAdmin(teamId, userId);
    if (!isAdmin) {
      throw new ForbiddenException(`You are not an admin of this team`);
    }
  }
}