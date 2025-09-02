import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { seedDatabase } from './seed';
import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';
import { TeamMember } from '../../teams/entities/team-member.entity';
import { Task } from '../../tasks/entities/task.entity';

async function runSeed() {
  const configService = new ConfigService();
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_DATABASE', 'vibe_space'),
    entities: [User, Team, TeamMember, Task],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');
    
    await seedDatabase(dataSource);
    
    await dataSource.destroy();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();