import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, userRoleEnum } from './entities/user.entity';

@UseGuards(AuthGuard('adminJwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 201, description: 'Успешная операция', type: User })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Успешная операция',
    type: User,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Успешная операция', type: User })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция', type: User })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.findOne(+id);

    if (user.role === userRoleEnum.admin) throw new UnauthorizedException();

    return this.usersService.update(+id, updateUserDto);
  }

  @ApiResponse({ status: 200, description: 'Успешная операция' })
  @ApiResponse({ status: 401, description: 'Пользователь неавторизован' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findOne(+id);

    if (user.role === userRoleEnum.admin) throw new UnauthorizedException();

    return this.usersService.remove(+id);
  }
}
