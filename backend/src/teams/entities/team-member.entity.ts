import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';

export enum TeamRole {
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TeamRole,
    default: TeamRole.MEMBER,
  })
  role: TeamRole;

  @ManyToOne(() => User, (user) => user.teamMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column()
  teamId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}