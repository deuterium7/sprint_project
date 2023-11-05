import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminUsersController } from './admin.users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAlreadyExistsRule } from './rules/user.already.exists';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminUsersController],
  providers: [UsersService, UserAlreadyExistsRule],
  exports: [UsersService, UserAlreadyExistsRule],
})
export class UsersModule {}
