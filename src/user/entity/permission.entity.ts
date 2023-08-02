import { AbstractEntity } from '../../common/models/AbstractEntity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_permission_name_id', ['name'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
class Permission extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column({ default: true })
  public active!: boolean;
}

export default Permission;
