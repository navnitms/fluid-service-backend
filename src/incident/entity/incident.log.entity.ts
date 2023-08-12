import { AbstractEntity } from '../../common/models/AbstractEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Incident } from './incident.entity';
import { IncidentOperation } from '../../schema/graphql.schema';
import { User } from '../../user/entity/user.entity';

@Index('idx_incident_activity_log_user_id_date', ['incidentId'], {
  where: `"deleted_at" IS NULL`,
})
@Entity()
export class IncidentLog extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public incidentId!: string;

  @ManyToOne(() => Incident, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'incident_id' })
  public incident!: Incident;

  @Column()
  public userId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  public user!: User;

  @Column()
  public operation!: IncidentOperation;

  @Column({ length: 1024 })
  public text: string;
}
