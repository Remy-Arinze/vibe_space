"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const seed_1 = require("./seed");
const user_entity_1 = require("../../users/entities/user.entity");
const team_entity_1 = require("../../teams/entities/team.entity");
const team_member_entity_1 = require("../../teams/entities/team-member.entity");
const task_entity_1 = require("../../tasks/entities/task.entity");
async function runSeed() {
    const configService = new config_1.ConfigService();
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'vibe_space'),
        entities: [user_entity_1.User, team_entity_1.Team, team_member_entity_1.TeamMember, task_entity_1.Task],
        synchronize: true,
    });
    try {
        await dataSource.initialize();
        console.log('Database connection established');
        await (0, seed_1.seedDatabase)(dataSource);
        await dataSource.destroy();
        console.log('Seeding completed successfully');
    }
    catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}
runSeed();
//# sourceMappingURL=run-seed.js.map