import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AdminBrandsController } from './admin.brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandExists } from './rules/brand.exists';
import { BrandAlreadyExists } from './rules/brand.already.exists';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController, AdminBrandsController],
  providers: [BrandsService, BrandExists, BrandAlreadyExists],
  exports: [BrandsService, BrandExists, BrandAlreadyExists],
})
export class BrandsModule {}
