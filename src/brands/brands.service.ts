import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private repository: Repository<Brand>,
  ) {}

  create(data: CreateBrandDto): Promise<Brand> {
    return this.repository.save({ ...data });
  }

  findAll(): Promise<Brand[]> {
    return this.repository.find();
  }

  findOne(id: number): Promise<Brand | null> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, data: UpdateBrandDto): Promise<Brand> {
    return this.repository.save({ ...data, id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
