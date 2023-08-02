import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../common/models/AbstractEntity';

@Entity()
export class TenantCategory extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false })
  @Index('idx_tenant_category_name', {
    unique: true,
    where: `"deleted_at" IS NULL`,
  })
  public name!: string;
}
