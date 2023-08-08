import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CommonModule } from 'src/common/common.module';
import { ConfigService } from 'src/common/config/config.service';
import { DbConfig } from './models/DbConfig';

export default TypeOrmModule.forRootAsync({
  imports: [CommonModule],
  inject: [ConfigService],
  async useFactory(config: ConfigService) {
    const { type, database, username, password, host, port } =
      config.get<DbConfig>('db');
    return {
      type,
      host,
      port,
      database,
      username,
      password,
      entities: [
        // __dirname + '/../../**/*.entity.ts',
        __dirname + '/../**/*.entity.js',
      ],
      synchronize: false,
      logging: ['error', 'query'],
      namingStrategy: new SnakeNamingStrategy(),
      ssl: false,
    };
  },
} as TypeOrmModuleOptions);
