import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class State {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public name?: string;

  @Column({ type: 'boolean', default: false })
  public isDisabled!: boolean;

  @DeleteDateColumn()
  public deletedAt?: Date;
}
