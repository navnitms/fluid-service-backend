import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from './state.entity';

@Entity()
export class District {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public name?: string;

  @ManyToOne(() => State, {
    cascade: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  public state!: State;

  @Column()
  public stateId!: string;

  @DeleteDateColumn()
  public deletedAt?: Date;
}
