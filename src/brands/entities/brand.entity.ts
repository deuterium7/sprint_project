import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Car } from 'src/cars/entities/car.entity';

@Entity('brands')
export class Brand {
  @ApiProperty({ minimum: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Car, (car) => car.brand)
  cars: Car[];
}
