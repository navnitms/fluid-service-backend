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

@Index('idx_tenant_fa_tenant_id', ['tenantId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class TenantFa extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public tenantId!: string;

  @ManyToOne('Tenant', 'tenantNotes', { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_id' })
  public tenant!: Tenant;

  @Column({ name: 'date', type: 'timestamptz', nullable: false })
  public date!: Date;

  @Column()
  public remark!: string;
}
