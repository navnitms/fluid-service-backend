import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../common/models/AbstractEntity';

@Index('idx_tenant_settings_tenant_id', ['tenantId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class TenantSettings extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public tenantId!: string;

  @Column()
  public replyToEmail!: string;

  @Column({ default: true })
  autoEscalation!: boolean;
}
