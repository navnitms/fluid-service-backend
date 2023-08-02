import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../common/models/AbstractEntity';

@Entity()
export class Category extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  @Index('idx_category_name', {
    unique: true,
    where: `"deleted_at" IS NULL`,
  })
  public name!: string;

  @Column({ default: true })
  public isVisible!: boolean;
}
