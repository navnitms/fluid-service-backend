import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entity/tenant.entity';
import { AbstractEntity } from '../../common/models/AbstractEntity';
import { UserStatus } from '../enums/user.status.enum';
import Role from './role.entity';

@Entity()
@Index('idx_user_tenant_id_status', ['tenantId', 'status'], {
  where: `"deleted_at" IS NULL`,
})
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public name!: string;

  @Column({ nullable: false })
  public tenantId!: string;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_id' })
  public tenant!: Tenant;

  @Column()
  @Index('idx_user_email', {
    unique: true,
    where: `"deleted_at" IS NULL`,
  })
  public email!: string;

  @Column({ default: UserStatus.INVITED })
  public status!: UserStatus;

  @Column()
  public password!: string;

  @Column({ nullable: true })
  public refreshToken?: string;

  @Column({ nullable: true })
  public inviteToken?: string;

  @ManyToOne(() => Role, {
    cascade: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  public role?: Role;
}
