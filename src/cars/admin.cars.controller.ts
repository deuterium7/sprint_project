import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';

@UseGuards(AuthGuard('adminJwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/cars')
export class AdminCarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiResponse({ status: 201, description: 'Успешная операция', type: Car })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Post()
  create(@Body() createCarDto: CreateCarDto, @Request() req: any) {
    return this.carsService.create(createCarDto, req.user['sub']);
  }

  @ApiBody({
    schema: {
      example: {
        name: 'string',
        category_ids: [],
        brand_ids: [],
        min_price: 1,
        max_price: 1,
        per_page: 10,
        page: 1,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    schema: {
      example: {
        data: [
          {
            id: 1,
            user_id: 1,
            category_id: 1,
            brand_id: 1,
            name: 'string',
            description: 'string',
            price: '10000',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: {
              id: 1,
              name: 'string',
            },
            brand: {
              id: 1,
              name: 'string',
            },
          },
        ],
        meta: { page: 1, per_page: 10 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get()
  findAll(@Query() query: object): Promise<object> {
    return this.carsService.findAll(query);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция', type: Car })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Car | null> {
    return this.carsService.findOne(+id);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция', type: Car })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    return this.carsService.update(+id, updateCarDto);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.carsService.remove(+id);
  }
}
