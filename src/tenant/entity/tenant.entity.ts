import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { AbstractEntity } from '../../common/models/AbstractEntity';
import { TenantCategory } from './tenant.category.entity';
import { TenantSettings } from './tenant.settings.entity';

@Entity()
export class Tenant extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  @Index('idx_tenant_name', {
    unique: true,
    where: `"deleted_at" IS NULL`,
  })
  public name!: string;

  @Column({ nullable: true })
  public addressId?: string;

  @OneToOne(() => TenantSettings, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_setting_id' })
  tenantSetting?: TenantSettings;

  @OneToOne(() => Address, {
    cascade: false,
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'address_id',
    referencedColumnName: 'id',
  })
  address?: Address;

  @Column({ nullable: false })
  public categoryId!: string;

  @ManyToOne(() => TenantCategory, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'category_id' })
  public category!: TenantCategory;
}
