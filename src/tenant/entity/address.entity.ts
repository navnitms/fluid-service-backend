import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../../common/models/AbstractEntity';
import { District } from './district.entity';

@Index('idx_address_tenant_id', ['tenantId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class Address extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public tenantId!: string;

  @Column({ nullable: true })
  public value?: string;

  @Column({ type: 'uuid' })
  public districtId: string;

  @ManyToOne(() => District, {
    cascade: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  public district!: District;

  @Column({ nullable: true })
  public pincode?: number;
}
