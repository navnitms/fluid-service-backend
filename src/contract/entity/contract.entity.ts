import { Tenant } from '../../tenant/entity/tenant.entity';
import { AbstractEntity } from '../../common/models/AbstractEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractStatus } from '../../schema/graphql.schema';
import { ContractProduct } from './contract.product.entity';

@Index('idx_contract_tenant_id', ['tenantId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class Contract extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false })
  public tenantId!: string;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_id' })
  public tenant!: Tenant;

  @Column({ name: 'from_date', type: 'timestamptz', nullable: false })
  public startDate!: Date;

  @Column({ name: 'to_date', type: 'timestamptz', nullable: false })
  public endDate!: Date;

  @Column({ name: 'payment_date', type: 'timestamptz', nullable: true })
  public paymentDate?: Date;

  @Column({ enum: ContractStatus, default: ContractStatus.SCHEDULED })
  public status!: ContractStatus;

  @Column({ nullable: true })
  public remark?: string;

  @Column({ nullable: true })
  public amount?: number;

  @OneToMany(
    () => ContractProduct,
    (contractProduct) => contractProduct.contract,
    {
      createForeignKeyConstraints: true,
      cascade: false,
    },
  )
  public contractProduct?: ContractProduct[];
}
