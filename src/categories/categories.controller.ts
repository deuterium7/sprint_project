import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@ApiTags('User API')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: Category,
    isArray: true,
  })
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: Category,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.findOne(+id);
  }
}
