import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { IncidentResolver } from './resolver/incident.resolver';
import { IncidentService } from './service/incident.service';
import { UserModule } from 'src/user/user.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { IncidentLogService } from './service/incident.log.service';
import { IncidentLogLoader } from './loader/incident.log.loader';
import { IncidentLogResolver } from './resolver/incident.log.resolver';
import { IncidentCommentLoader } from './loader/incident.comment.loader';
import { CommentService } from './service/comment.service';
import { CommentResolver } from './resolver/comment.resolver';
import { ConfigService } from '@nestjs/config';
import { AuthenticationModule } from 'src/auth/authentication.module';
import CategoryLoader from './loader/category.loader';
import { CategoryService } from './service/category.service';
import { CategoryResolver } from './resolver/category.resolver';
import { PriorityResolver } from './resolver/priority.resolver';
import { IncidentStatusResolver } from './resolver/incident.status.resolver';

@Module({
  imports: [CommonModule, UserModule, TenantModule, AuthenticationModule],
  providers: [
    IncidentResolver,
    IncidentService,
    IncidentLogLoader,
    IncidentLogService,
    IncidentLogResolver,
    IncidentCommentLoader,
    CommentService,
    CommentResolver,
    ConfigService,
    CategoryLoader,
    CategoryService,
    CategoryResolver,
    PriorityResolver,
    IncidentStatusResolver,
  ],
  exports: [IncidentService],
})
export class IncidentModule {}
