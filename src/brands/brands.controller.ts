import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';

@ApiTags('User API')
@Controller('api/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: Brand,
    isArray: true,
  })
  @Get()
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Успешная операция', type: Brand })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Brand | null> {
    return this.brandsService.findOne(+id);
  }
}
