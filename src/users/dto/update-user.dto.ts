import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @ApiProperty({ description: 'ФИО пользователя' })
  name: string;
}
