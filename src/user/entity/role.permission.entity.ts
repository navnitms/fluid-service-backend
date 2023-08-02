import { AbstractEntity } from '../../common/models/AbstractEntity';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
class RolePermission extends AbstractEntity {
  @PrimaryColumn({ type: 'uuid' })
  public permissionId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public roleId!: string;
}

export default RolePermission;
