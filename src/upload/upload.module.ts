import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UploadService } from './service/upload.service';
import { UploadResolver } from './resolver/upload.resolver';
import { FileService } from './service/file.service';
import { AuthenticationModule } from 'src/auth/authentication.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CommonModule, AuthenticationModule, UserModule],
  providers: [UploadService, UploadResolver, FileService],
  exports: [],
})
export class UploadModule {}
