import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UserAlreadyExistsRule } from '../user.already.exists';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @ApiProperty({ description: 'ФИО пользователя' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(UserAlreadyExistsRule)
  @ApiProperty({ description: 'Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ description: 'Пароль' })
  password: string;
}
