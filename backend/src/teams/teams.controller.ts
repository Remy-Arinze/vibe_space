import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberRoleDto } from './dto/update-team-member-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @GetUser() user: User) {
    return this.teamsService.create(createTeamDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.teamsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    // Verify user is a member of the team
    await this.teamsService.verifyUserIsTeamMember(id, user.id);
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @GetUser() user: User) {
    return this.teamsService.update(id, updateTeamDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.teamsService.remove(id, user.id);
  }

  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() addTeamMemberDto: AddTeamMemberDto,
    @GetUser() user: User,
  ) {
    return this.teamsService.addMember(id, addTeamMemberDto, user.id);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ) {
    return this.teamsService.removeMember(id, userId, user.id);
  }

  @Patch(':id/members/:userId/role')
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateTeamMemberRoleDto: UpdateTeamMemberRoleDto,
    @GetUser() user: User,
  ) {
    return this.teamsService.updateMemberRole(
      id,
      userId,
      updateTeamMemberRoleDto.role,
      user.id,
    );
  }

  @Get(':id/members')
  async getTeamMembers(@Param('id') id: string, @GetUser() user: User) {
    // Verify user is a member of the team
    await this.teamsService.verifyUserIsTeamMember(id, user.id);
    return this.teamsService.getTeamMembers(id);
  }
}