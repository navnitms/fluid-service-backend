import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../../common/models/AbstractEntity';
import { Tenant } from './tenant.entity';

@Index('idx_tenant_notes_tenant_id', ['tenantId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class TenantNotes extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public tenantId!: string;

  @ManyToOne('Tenant', 'tenantNotes', { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_id' })
  public tenant!: Tenant;

  @Column()
  public remark!: string;
}
