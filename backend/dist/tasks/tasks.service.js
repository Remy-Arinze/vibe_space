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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const teams_service_1 = require("../teams/teams.service");
const users_service_1 = require("../users/users.service");
let TasksService = class TasksService {
    constructor(tasksRepository, teamsService, usersService) {
        this.tasksRepository = tasksRepository;
        this.teamsService = teamsService;
        this.usersService = usersService;
    }
    async create(createTaskDto, creator) {
        const isMember = await this.teamsService.isUserTeamMember(createTaskDto.teamId, creator.id);
        if (!isMember) {
            throw new common_1.ForbiddenException('You must be a team member to create tasks');
        }
        if (createTaskDto.assigneeId) {
            const assignee = await this.usersService.findOne(createTaskDto.assigneeId);
            const isAssigneeMember = await this.teamsService.isUserTeamMember(createTaskDto.teamId, assignee.id);
            if (!isAssigneeMember) {
                throw new common_1.ForbiddenException('Assignee must be a team member');
            }
        }
        const task = this.tasksRepository.create({
            ...createTaskDto,
            creator,
            creatorId: creator.id,
        });
        return this.tasksRepository.save(task);
    }
    async findAll(teamId, userId) {
        const isMember = await this.teamsService.isUserTeamMember(teamId, userId);
        if (!isMember) {
            throw new common_1.ForbiddenException('You must be a team member to view tasks');
        }
        return this.tasksRepository.find({
            where: { teamId },
            relations: ['creator', 'assignee'],
        });
    }
    async findOne(id, userId) {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['creator', 'assignee', 'team'],
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        const isMember = await this.teamsService.isUserTeamMember(userId, task.teamId);
        if (!isMember) {
            throw new common_1.ForbiddenException('You must be a team member to view this task');
        }
        return task;
    }
    async update(id, updateTaskDto, userId) {
        const task = await this.findOne(id, userId);
        if (updateTaskDto.assigneeId) {
            const assignee = await this.usersService.findOne(updateTaskDto.assigneeId);
            const isAssigneeMember = await this.teamsService.isUserTeamMember(assignee.id, task.teamId);
            if (!isAssigneeMember) {
                throw new common_1.ForbiddenException('Assignee must be a team member');
            }
        }
        const updatedTask = this.tasksRepository.merge(task, updateTaskDto);
        return this.tasksRepository.save(updatedTask);
    }
    async remove(id, userId) {
        const task = await this.findOne(id, userId);
        const isAdmin = await this.teamsService.isUserTeamAdmin(userId, task.teamId);
        if (!isAdmin && task.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only task creators or team admins can delete tasks');
        }
        await this.tasksRepository.remove(task);
    }
    async getTasksByAssignee(userId) {
        return this.tasksRepository.find({
            where: { assigneeId: userId },
            relations: ['team', 'creator'],
        });
    }
    async getTasksByCreator(userId) {
        return this.tasksRepository.find({
            where: { creatorId: userId },
            relations: ['team', 'assignee'],
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        teams_service_1.TeamsService,
        users_service_1.UsersService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map