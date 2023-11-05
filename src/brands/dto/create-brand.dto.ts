import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { BrandAlreadyExists } from '../rules/brand.already.exists';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Validate(BrandAlreadyExists)
  @ApiProperty({ description: 'Марка' })
  name: string;
}
