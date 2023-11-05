import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { User } from 'src/users/entities/user.entity';

export enum carStatusEnum {
  NEW = 'NEW',
  CLOSED = 'CLOSED',
}

@Entity('cars')
export class Car {
  @ApiProperty({ minimum: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('int')
  user_id: number;

  @ApiProperty()
  @Column('int')
  category_id: number;

  @ApiProperty()
  @Column('int')
  brand_id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column({ type: 'bigint', unsigned: true })
  price: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: carStatusEnum,
    default: carStatusEnum.NEW,
  })
  status: carStatusEnum;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.cars, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Category, (category) => category.cars, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.cars, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  brand: Brand;
}
