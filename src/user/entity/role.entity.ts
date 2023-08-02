import { AbstractEntity } from '../../common/models/AbstractEntity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Role extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Index('idx_role_name', { unique: true, where: `"deleted_at" IS NULL` })
  @Column()
  public name!: string;

  @Column({ default: true })
  public active!: boolean;
}

export default Role;
