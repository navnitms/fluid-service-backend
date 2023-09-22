import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../../common/models/AbstractEntity';
import { Contract } from './contract.entity';

@Index('idx_contract_notes_contract_id', ['contractId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class ContractNotes extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public contractId!: string;

  @ManyToOne('Tenant', 'tenantNotes', { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_id' })
  public contract!: Contract;

  @Column({ length: 1024, nullable: false })
  public remark!: string;
}
