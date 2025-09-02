import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberRoleDto } from './dto/update-team-member-role.dto';
import { User } from '../users/entities/user.entity';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(createTeamDto: CreateTeamDto, user: User): Promise<import("./entities/team.entity").Team>;
    findAll(user: User): Promise<import("./entities/team.entity").Team[]>;
    findOne(id: string, user: User): Promise<import("./entities/team.entity").Team>;
    update(id: string, updateTeamDto: UpdateTeamDto, user: User): Promise<import("./entities/team.entity").Team>;
    remove(id: string, user: User): Promise<void>;
    addMember(id: string, addTeamMemberDto: AddTeamMemberDto, user: User): Promise<import("./entities/team-member.entity").TeamMember>;
    removeMember(id: string, userId: string, user: User): Promise<void>;
    updateMemberRole(id: string, userId: string, updateTeamMemberRoleDto: UpdateTeamMemberRoleDto, user: User): Promise<import("./entities/team-member.entity").TeamMember>;
    getTeamMembers(id: string, user: User): Promise<import("./entities/team-member.entity").TeamMember[]>;
}
