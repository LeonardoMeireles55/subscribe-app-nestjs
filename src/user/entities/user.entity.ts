import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workshop } from '../../workshop/entities/workShop.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Column()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @Column()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Column()
  @ApiProperty({ example: 'securepassword' })
  password: string;

  @ManyToMany(() => Workshop, (workshop) => workshop.workShopUsers)
  @JoinTable()
  @ApiProperty({ type: () => Workshop, isArray: true })
  workShops: Workshop[] | number[];

  @Column({ default: true })
  @ApiProperty({ example: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
