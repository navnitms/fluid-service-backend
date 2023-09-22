import { Inject } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Permissions } from 'src/auth/decorator/permission.decorator';
import { UploadService } from '../service/upload.service';
import {
  PermissionType,
  PreSignedUrlInput,
  Upload,
} from 'src/schema/graphql.schema';

@Resolver('Upload')
export class UploadResolver {
  constructor(
    @Inject(UploadService)
    private readonly uploadService: UploadService,
  ) {}

  @Permissions(PermissionType.ViewAllIncidents)
  @Mutation()
  async getPresignedUploadUrl(
    @Context('user') user: any,
    @Args('input') input: PreSignedUrlInput,
  ): Promise<Upload> {
    return this.uploadService.generatePresignedUrlForUpload(
      user.tenantId,
      input.name,
      input.incidentId,
    );
  }
}
