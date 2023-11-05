import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { CategoryExists } from 'src/categories/rules/category.exists';
import { BrandExists } from 'src/brands/rules/brand.exists';

export class CreateCarDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Validate(CategoryExists)
  @ApiProperty({
    description: 'ID категории',
    minimum: 1,
  })
  category_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Validate(BrandExists)
  @ApiProperty({
    description: 'ID марки',
    minimum: 1,
  })
  brand_id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @ApiProperty({ description: 'Название' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty({ description: 'Описание' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100000000000)
  @ApiProperty({
    description: 'Цена USD',
    minimum: 1,
  })
  price: number;
}
