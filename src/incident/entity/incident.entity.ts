import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IncidentStatus, Priority } from '../../schema/graphql.schema';
import { Category } from './category.entity';
import { Tenant } from '../../tenant/entity/tenant.entity';
import { User } from '../../user/entity/user.entity';
import { AbstractEntity } from '../../common/models/AbstractEntity';
import { Comment } from './comment.entity';
import { IncidentLog } from './incident.log.entity';

@Entity()
@Index('idx_incident_tenant_id_status', ['tenantId', 'status'], {
  where: `"deleted_at" IS NULL`,
})
export class Incident extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 1024, nullable: false })
  public title: string;

  @Column({ length: 100000, nullable: false })
  public description: string;

  @Column({ nullable: false })
  public shortId!: string;

  @Column({ nullable: false })
  public priority!: Priority;

  @Column({ nullable: false })
  public status!: IncidentStatus;

  @Column({ nullable: false })
  public categoryId!: string;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'category_id' })
  public category!: Category;

  @Column({ nullable: false })
  public tenantId!: string;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'tenant_id' })
  public tenant!: Tenant;

  @Column({ nullable: false })
  public createdById!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'created_by_id' })
  public createdBy!: User;

  @Column({ nullable: true })
  public assigneeId!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'assignee_id' })
  public assignee!: User;

  @Column({ nullable: true })
  public acknowledgedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'acknowledged_by_id' })
  public acknowledgedBy: User;

  @Column({ nullable: true })
  public escalatedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'escalated_by_id' })
  public escalatedBy: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.incident)
  @JoinColumn()
  public comments?: Comment[];

  @OneToMany(
    () => IncidentLog,
    (incidentLog: IncidentLog) => incidentLog.incident,
  )
  @JoinColumn()
  public incidentLogs?: IncidentLog[];

  @Column({ type: 'tsvector', nullable: true })
  searchTerm?: string;
}
