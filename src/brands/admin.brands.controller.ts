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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@UseGuards(AuthGuard('adminJwt'))
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/brands')
export class AdminBrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiResponse({ status: 201, description: 'Успешная операция', type: Brand })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Post()
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: Brand,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get()
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Успешная операция', type: Brand })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Brand | null> {
    return this.brandsService.findOne(+id);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция', type: Brand })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.brandsService.remove(+id);
  }
}
