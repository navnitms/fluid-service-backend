import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSourceOptions } from 'typeorm';
import { configuration } from '../../src/common/config/app.config';

const { type, host, port, username, password, database } = configuration.db;

const migrationConfig = {
  type,
  host,
  port,
  username,
  password,
  database,
  migrations: ['dist/migrations/scripts/*.js'],
  entities: [
    __dirname + '/../../**/*.entity.ts',
    __dirname + '/../../**/*.entity.js',
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  ssl: true,
} as DataSourceOptions;

export default migrationConfig;
