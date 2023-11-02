import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@UseGuards(AuthGuard('adminJwt'))
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({
    status: 201,
    description: 'Успешная операция',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: Category,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: Category,
  })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(+id);
  }
}
