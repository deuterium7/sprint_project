import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AdminBrandsController } from './admin.brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandExistsRule } from './brand.exists';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController, AdminBrandsController],
  providers: [BrandsService, BrandExistsRule],
  exports: [BrandsService, BrandExistsRule],
})
export class BrandsModule {}
