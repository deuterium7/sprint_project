import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, carStatusEnum } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private repository: Repository<Car>,
  ) {}

  create(data: CreateCarDto, user_id: number): Promise<Car> {
    return this.repository.save({ ...data, user_id });
  }

  async findAll(query: object): Promise<object> {
    const meta = {
      per_page: Number(query['per_page']) || 10,
      page: Number(query['page']) || 1,
    };

    const cars = this.repository
      .createQueryBuilder('cars')
      .leftJoinAndSelect('cars.category', 'category')
      .leftJoinAndSelect('cars.brand', 'brand')
      .leftJoinAndSelect('cars.user', 'user')
      .where('cars.status=:status', { status: carStatusEnum.NEW });

    if (query['name'])
      cars.andWhere('cars.name LIKE :carsName', {
        carsName: `%${query['name']}%`,
      });
    if (query['category_ids'])
      cars.andWhere('category.id IN (:categoryIds)', {
        categoryIds: query['category_ids'],
      });
    if (query['brand_ids'])
      cars.andWhere('brand.id IN (:brandIds)', {
        brandIds: query['brand_ids'],
      });
    if (query['min_price'])
      cars.andWhere('cars.price >= :minPrice', {
        minPrice: query['min_price'],
      });
    if (query['max_price'])
      cars.andWhere('cars.price <= :maxPrice', {
        maxPrice: query['max_price'],
      });

    const data = await cars
      .orderBy('cars.id', 'DESC')
      .offset((meta.page - 1) * meta.per_page)
      .limit(meta.per_page)
      .getMany();

    return { data, meta };
  }

  findOne(id: number): Promise<Car | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        category: true,
        brand: true,
        user: true,
      },
    });
  }

  update(id: number, data: UpdateCarDto): Promise<Car> {
    return this.repository.save({ ...data, id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
