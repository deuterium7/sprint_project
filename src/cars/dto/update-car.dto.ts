import { ApiProperty } from '@nestjs/swagger';
import { carStatusEnum } from '../entities/car.entity';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { CategoryExistsRule } from 'src/categories/category.exists';
import { BrandExistsRule } from 'src/brands/brand.exists';

export class UpdateCarDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Validate(CategoryExistsRule)
  @ApiProperty({
    description: 'ID категории',
    minimum: 1,
  })
  category_id: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Validate(BrandExistsRule)
  @ApiProperty({
    description: 'ID марки',
    minimum: 1,
  })
  brand_id: number;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @ApiProperty({ description: 'Название' })
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty({ description: 'Описание' })
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100000000000)
  @ApiProperty({
    description: 'Цена USD',
    minimum: 1,
  })
  price: number;

  @IsOptional()
  @IsEnum(carStatusEnum)
  @ApiProperty({ description: 'Статус' })
  status: carStatusEnum;
}
