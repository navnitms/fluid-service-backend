import { AbstractEntity } from '../../common/models/AbstractEntity';
import { UploadType } from '../../schema/graphql.schema';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UploadStatus } from '../enum/upload.status.enum';

@Entity()
export class Upload extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public tenantId!: string;

  @Column({ nullable: false })
  public name!: string;

  @Column({ nullable: false })
  public key!: string;

  @Column({ type: 'uuid' })
  public referenceId!: string;

  @Column({ nullable: false, enum: UploadStatus })
  public status: UploadStatus;

  @Column({ nullable: false, enum: UploadType })
  public referenceType: UploadType;
}
