import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const migrationConfig = {
  type: 'postgres',
  host: 'localhost' || 'localhost',
  port: 5432,
  database: 'fluid-db' || '',
  username: 'fluid-dev-user' || '',
  password: 'fluid-dev-password' || '',
  entities: [
    __dirname + '/../../**/*.entity.ts',
    __dirname + '/../../**/*.entity.js',
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: 'migrations',
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
export default migrationConfig;
