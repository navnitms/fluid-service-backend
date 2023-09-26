import { AbstractEntity } from '../../common/models/AbstractEntity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractProduct } from './contract.product.entity';

@Entity()
export class Product extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  @Index('idx_product_name', {
    unique: true,
    where: `"deleted_at" IS NULL`,
  })
  public name!: string;

  @Column({ default: true })
  public isVisible!: boolean;

  @Column({ nullable: true })
  public amount?: number;

  @OneToMany(
    () => ContractProduct,
    (contractProduct) => contractProduct.product,
    { createForeignKeyConstraints: false },
  )
  public contractProduct!: ContractProduct[];
}
