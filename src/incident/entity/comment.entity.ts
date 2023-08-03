import { User } from '../../user/entity/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entity/tenant.entity';
import { Incident } from './incident.entity';
import { AbstractEntity } from '../../common/models/AbstractEntity';

@Index('idx_incident_comment', ['incidentId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class Comment extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false })
  public tenantId!: string;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_id' })
  public tenant!: Tenant;

  @Column({ type: 'varchar', nullable: false })
  public text!: string;

  @ManyToOne(() => Incident, (incident: Incident) => incident.comments, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  incident?: Incident;

  @Column()
  incidentId!: string;

  @Column({ nullable: false })
  public userId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  public user!: User;
}
