import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppGraphQLModule } from './graphql/graphql.module';
import { TenantModule } from './tenant/tenant.module';
import database from './database';
import { LoggerMiddleware } from './common/middlewares/logging.middleware';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { IncidentModule } from './incident/incident.module';

@Module({
  imports: [
    AppGraphQLModule,
    TenantModule,
    database,
    CommonModule,
    UserModule,
    IncidentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
