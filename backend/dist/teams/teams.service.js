"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("./entities/team.entity");
const team_member_entity_1 = require("./entities/team-member.entity");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../common/services/email.service");
let TeamsService = class TeamsService {
    constructor(teamsRepository, teamMembersRepository, usersService, emailService) {
        this.teamsRepository = teamsRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.usersService = usersService;
        this.emailService = emailService;
    }
    async create(createTeamDto, user) {
        const team = this.teamsRepository.create(createTeamDto);
        const savedTeam = await this.teamsRepository.save(team);
        const teamMember = this.teamMembersRepository.create({
            team: savedTeam,
            teamId: savedTeam.id,
            user,
            userId: user.id,
            role: team_member_entity_1.TeamRole.ADMIN,
        });
        await this.teamMembersRepository.save(teamMember);
        return savedTeam;
    }
    async findAll(userId) {
        const teamMembers = await this.teamMembersRepository.find({
            where: { userId },
            relations: ['team'],
        });
        return teamMembers.map(member => member.team);
    }
    async findOne(id) {
        const team = await this.teamsRepository.findOne({
            where: { id },
            relations: ['members', 'members.user', 'tasks'],
        });
        if (!team) {
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        }
        return team;
    }
    async update(id, updateTeamDto, userId) {
        const team = await this.findOne(id);
        await this.verifyUserIsTeamAdmin(id, userId);
        Object.assign(team, updateTeamDto);
        return this.teamsRepository.save(team);
    }
    async remove(id, userId) {
        const team = await this.findOne(id);
        await this.verifyUserIsTeamAdmin(id, userId);
        await this.teamsRepository.remove(team);
    }
    async addMember(teamId, addTeamMemberDto, userId) {
        const team = await this.findOne(teamId);
        await this.verifyUserIsTeamAdmin(teamId, userId);
        const userToAdd = await this.usersService.findByEmail(addTeamMemberDto.email);
        if (!userToAdd)
            throw new common_1.NotFoundException(`User with email ${addTeamMemberDto.email} not found`);
        const existingMember = await this.teamMembersRepository.findOne({
            where: { teamId, userId: userToAdd.id },
        });
        if (existingMember)
            throw new common_1.BadRequestException(`User is already a member of this team`);
        const teamMember = this.teamMembersRepository.create({
            team,
            teamId,
            user: userToAdd,
            userId: userToAdd.id,
            role: addTeamMemberDto.role || team_member_entity_1.TeamRole.MEMBER,
        });
        const savedMember = await this.teamMembersRepository.save(teamMember);
        await this.emailService.sendEmail(`"Team Manager" <${process.env.MAIL_FROM}>`, 'You have been added to a team', `<h1>Email Verification</h1>
        <p>Hello ${userToAdd.username},</p>
        <p>You have been added to the team "${team.name}" with the role "${teamMember.role}"</p>
        <p>Best regards</p>
        <p>Team Manager</p>
        `);
        return savedMember;
    }
    async removeMember(teamId, memberUserId, requestingUserId) {
        const team = await this.findOne(teamId);
        if (memberUserId !== requestingUserId) {
            await this.verifyUserIsTeamAdmin(teamId, requestingUserId);
        }
        const teamMember = await this.teamMembersRepository.findOne({
            where: { teamId, userId: memberUserId },
            relations: ['user', 'team'],
        });
        if (!teamMember) {
            throw new common_1.NotFoundException(`User is not a member of this team`);
        }
        if (teamMember.role === team_member_entity_1.TeamRole.ADMIN) {
            const adminCount = await this.teamMembersRepository.count({
                where: { teamId, role: team_member_entity_1.TeamRole.ADMIN },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException(`Cannot remove the last admin from the team`);
            }
        }
        await this.teamMembersRepository.remove(teamMember);
        await this.emailService.sendEmail(`"Team Manager" <${process.env.MAIL_FROM}>`, 'You have been removed from a team', `<h1>Team Removal Notification</h1>
     <p>Hello ${teamMember.user.username},</p>
     <p>You have been removed from the team "${teamMember.team.name}".</p>
     <p>If you believe this was a mistake, please contact your team administrator.</p>
     <p>Best regards,</p>
     <p>Team Manager</p>`);
    }
    async updateMemberRole(teamId, memberUserId, role, requestingUserId) {
        await this.findOne(teamId);
        await this.verifyUserIsTeamAdmin(teamId, requestingUserId);
        const teamMember = await this.teamMembersRepository.findOne({ where: { teamId, userId: memberUserId }, relations: ['user', 'team'] });
        if (!teamMember)
            throw new common_1.NotFoundException(`User is not a member of this team`);
        if (teamMember.role === team_member_entity_1.TeamRole.ADMIN && role === team_member_entity_1.TeamRole.MEMBER) {
            const adminCount = await this.teamMembersRepository.count({ where: { teamId, role: team_member_entity_1.TeamRole.ADMIN } });
            if (adminCount <= 1)
                throw new common_1.BadRequestException(`Cannot demote the last admin of the team`);
        }
        teamMember.role = role;
        const updatedMember = await this.teamMembersRepository.save(teamMember);
        await this.emailService.sendEmail(`"Team Manager" <${process.env.MAIL_FROM}>`, 'Your team role has been updated', `<h1>Role Update</h1>
        <p>Hello ${teamMember.user.username},"</p>
        <p>Your role in the team "${teamMember.team.name}" has been updated to "${role}"</p>
        <p>Best regards</p>
        <p>Team Manager</p>
    `);
        return updatedMember;
    }
    async getTeamMembers(teamId) {
        return this.teamMembersRepository.find({
            where: { teamId },
            relations: ['user'],
        });
    }
    async getUserTeamRole(teamId, userId) {
        const teamMember = await this.teamMembersRepository.findOne({
            where: { teamId, userId },
        });
        return teamMember ? teamMember.role : null;
    }
    async isUserTeamMember(teamId, userId) {
        const count = await this.teamMembersRepository.count({
            where: { teamId, userId },
        });
        return count > 0;
    }
    async isUserTeamAdmin(teamId, userId) {
        const teamMember = await this.teamMembersRepository.findOne({
            where: { teamId, userId },
        });
        return teamMember?.role === team_member_entity_1.TeamRole.ADMIN;
    }
    async verifyUserIsTeamMember(teamId, userId) {
        const isMember = await this.isUserTeamMember(teamId, userId);
        if (!isMember) {
            throw new common_1.ForbiddenException(`You are not a member of this team`);
        }
    }
    async verifyUserIsTeamAdmin(teamId, userId) {
        const isAdmin = await this.isUserTeamAdmin(teamId, userId);
        if (!isAdmin) {
            throw new common_1.ForbiddenException(`You are not an admin of this team`);
        }
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(1, (0, typeorm_1.InjectRepository)(team_member_entity_1.TeamMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        email_service_1.EmailService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map