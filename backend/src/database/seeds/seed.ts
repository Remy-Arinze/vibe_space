import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';
import { TeamMember, TeamRole } from '../../teams/entities/team-member.entity';
import { Task, TaskStatus } from '../../tasks/entities/task.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const teamRepository = dataSource.getRepository(Team);
  const teamMemberRepository = dataSource.getRepository(TeamMember);
  const taskRepository = dataSource.getRepository(Task);

 // Clear existing data
await taskRepository.createQueryBuilder().delete().execute();
await teamMemberRepository.createQueryBuilder().delete().execute();
await teamRepository.createQueryBuilder().delete().execute();
await userRepository.createQueryBuilder().delete().execute();




  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = userRepository.create({
    email: 'john@example.com',
    username: 'john_doe',
    password: hashedPassword,
    isEmailVerified: true,
  });

  const user2 = userRepository.create({
    email: 'jane@example.com',
    username: 'jane_smith',
    password: hashedPassword,
    isEmailVerified: true,
  });

  const user3 = userRepository.create({
    email: 'bob@example.com',
    username: 'bob_wilson',
    password: hashedPassword,
    isEmailVerified: true,
  });

  const savedUsers = await userRepository.save([user1, user2, user3]);
  console.log('Created users:', savedUsers.map(u => u.username));

  // Create teams
  const team1 = teamRepository.create({
    name: 'Development Team',
    description: 'Main development team for the project',
  });

  const team2 = teamRepository.create({
    name: 'Marketing Team',
    description: 'Marketing and content creation team',
  });

  const savedTeams = await teamRepository.save([team1, team2]);
  console.log('Created teams:', savedTeams.map(t => t.name));

  // Create team memberships
  const teamMember1 = teamMemberRepository.create({
    user: savedUsers[0],
    userId: savedUsers[0].id,
    team: savedTeams[0],
    teamId: savedTeams[0].id,
    role: TeamRole.ADMIN,
  });

  const teamMember2 = teamMemberRepository.create({
    user: savedUsers[1],
    userId: savedUsers[1].id,
    team: savedTeams[0],
    teamId: savedTeams[0].id,
    role: TeamRole.MEMBER,
  });

  const teamMember3 = teamMemberRepository.create({
    user: savedUsers[2],
    userId: savedUsers[2].id,
    team: savedTeams[1],
    teamId: savedTeams[1].id,
    role: TeamRole.ADMIN,
  });

  const teamMember4 = teamMemberRepository.create({
    user: savedUsers[0],
    userId: savedUsers[0].id,
    team: savedTeams[1],
    teamId: savedTeams[1].id,
    role: TeamRole.MEMBER,
  });

  await teamMemberRepository.save([teamMember1, teamMember2, teamMember3, teamMember4]);
  console.log('Created team memberships');

  // Create tasks
  const task1 = taskRepository.create({
    title: 'Setup project structure',
    description: 'Initialize the project with proper folder structure and dependencies',
    status: TaskStatus.DONE,
    creator: savedUsers[0],
    creatorId: savedUsers[0].id,
    assignee: savedUsers[1],
    assigneeId: savedUsers[1].id,
    team: savedTeams[0],
    teamId: savedTeams[0].id,
  });

  const task2 = taskRepository.create({
    title: 'Implement authentication',
    description: 'Add user registration, login, and JWT authentication',
    status: TaskStatus.IN_PROGRESS,
    creator: savedUsers[0],
    creatorId: savedUsers[0].id,
    assignee: savedUsers[0],
    assigneeId: savedUsers[0].id,
    team: savedTeams[0],
    teamId: savedTeams[0].id,
  });

  const task3 = taskRepository.create({
    title: 'Design team management UI',
    description: 'Create wireframes and mockups for team management interface',
    status: TaskStatus.TODO,
    creator: savedUsers[1],
    creatorId: savedUsers[1].id,
    team: savedTeams[0],
    teamId: savedTeams[0].id,
  });

  const task4 = taskRepository.create({
    title: 'Create marketing content',
    description: 'Write blog posts and social media content for product launch',
    status: TaskStatus.IN_PROGRESS,
    creator: savedUsers[2],
    creatorId: savedUsers[2].id,
    assignee: savedUsers[0],
    assigneeId: savedUsers[0].id,
    team: savedTeams[1],
    teamId: savedTeams[1].id,
  });

  const task5 = taskRepository.create({
    title: 'Plan launch strategy',
    description: 'Develop comprehensive launch strategy and timeline',
    status: TaskStatus.TODO,
    creator: savedUsers[2],
    creatorId: savedUsers[2].id,
    team: savedTeams[1],
    teamId: savedTeams[1].id,
  });

  await taskRepository.save([task1, task2, task3, task4, task5]);
  console.log('Created tasks');

  console.log('Database seeded successfully!');
}