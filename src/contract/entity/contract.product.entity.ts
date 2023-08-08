import { AbstractEntity } from '../../common/models/AbstractEntity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { Product } from './product.entity';

@Index('idx_contract_product_contract_id', ['contractId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class ContractProduct extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public contractId!: string;

  @Column()
  public productId!: string;

  @Column({ nullable: true })
  public remark?: string;

  @Column({ nullable: true })
  public count?: number;

  @Column({ nullable: true })
  public productAmount?: number;

  @ManyToOne(() => Contract, (contract) => contract.contractProduct, {
    createForeignKeyConstraints: false,
  })
  public contract!: Contract;

  @ManyToOne(() => Product, (product) => product.contractProduct, {
    createForeignKeyConstraints: false,
  })
  public product!: Product;
}
