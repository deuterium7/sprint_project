import { Controller, Request, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @ApiTags('Auth')
  @ApiBody({
    schema: {
      example: { login: 'string', password: 'string' },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Успешная операция',
    schema: {
      example: { access_token: 'string' },
    },
  })
  @ApiResponse({ status: 401, description: 'Не удалось авторизоваться' })
  @Post('login')
  async login(@Request() req: any): Promise<object> {
    return this.authService.login(req.user);
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 201, description: 'Успешная операция', type: User })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @Post('register')
  register(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.create(data);
  }
}
