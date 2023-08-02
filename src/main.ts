import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionsFilter } from './exception/exception.filter';
import { createNamespace, Namespace } from 'cls-hooked';
import { TENANT_NAMESPACE } from './common/constants/app.constants';
import { namespaceMiddleware } from './common/middlewares/tenant.namespace.middleware';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  // const logger = LoggerService.getInstance('bootstrap()');
  const appOptions = {
    cors: {
      credentials: true,
      origin: true,
    },
  };
  const app = await NestFactory.create(AppModule, appOptions);

  // app.useLogger(app.get(LoggerService));

  const applicationNamespace: Namespace = createNamespace(TENANT_NAMESPACE);
  app.use(namespaceMiddleware(applicationNamespace));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionsFilter());
  await app.listen(process.env.PORT || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
