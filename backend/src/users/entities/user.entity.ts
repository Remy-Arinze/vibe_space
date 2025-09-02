import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TeamMember } from '../../teams/entities/team-member.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  verificationToken: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  verificationTokenExpiry: Date;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
  teamMembers: TeamMember[];

  @OneToMany(() => Task, (task) => task.creator)
  createdTasks: Task[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}