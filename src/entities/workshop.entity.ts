import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Check,
} from 'typeorm';
import { UserEntity } from './user.entity';
@Entity()
@Check(`"capacity" >= 0`)
export class WorkshopEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  capacity: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => UserEntity, (user) => user.workShops)
  workShopUsers: UserEntity[];

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
