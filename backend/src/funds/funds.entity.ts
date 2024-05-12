import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Funds {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stripeCustomerId: string;

  @Column()
  cash: number;

  @Column({ nullable: true })
  payment_id: string;

  @Column({ type: 'json', default: {} })
  custom_fields: any;

  @CreateDateColumn({ default: '() => NOW()' })
  created_at: Date;

  @UpdateDateColumn({ default: '() => NOW()' })
  updated_at: Date;
}
