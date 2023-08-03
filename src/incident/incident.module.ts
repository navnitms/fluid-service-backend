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

@Module({
  imports: [CommonModule, UserModule, TenantModule],
  providers: [
    IncidentResolver,
    IncidentService,
    IncidentLogLoader,
    IncidentLogService,
    IncidentLogResolver,
    IncidentCommentLoader,
    CommentService,
  ],
  exports: [],
})
export class IncidentModule {}
