import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, userRoleEnum } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    data.password = await bcrypt.hash(data.password, 10);
    return this.repository.save({ ...data });
  }

  findAll(): Promise<User[]> {
    return this.repository.findBy({ role: userRoleEnum.user });
  }

  findOne(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async getAdmin(email: string): Promise<User> {
    let admin = await this.findOneByEmail(email);

    if (!admin) {
      const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      admin = await this.repository.save({
        name: 'ADMIN',
        email: process.env.ADMIN_EMAIL,
        role: userRoleEnum.admin,
        password: password,
      });
    }

    return admin;
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return this.repository.save({ ...data, id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
