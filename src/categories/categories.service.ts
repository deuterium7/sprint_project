import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>,
  ) {}

  create(data: CreateCategoryDto): Promise<Category> {
    return this.repository.save({ ...data });
  }

  findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  findOne(id: number): Promise<Category | null> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, data: UpdateCategoryDto): Promise<Category> {
    return this.repository.save({ ...data, id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
