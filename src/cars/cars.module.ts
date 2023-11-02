import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { AdminCarsController } from './admin.cars.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarsController, AdminCarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
