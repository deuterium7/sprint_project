import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategoriesService } from '../categories.service';

@ValidatorConstraint({ name: 'CategoryExists', async: true })
@Injectable()
export class CategoryExists implements ValidatorConstraintInterface {
  constructor(private categoriesService: CategoriesService) {}

  async validate(value: string) {
    try {
      const category = await this.categoriesService.findOneByName(value);
      return !category;
    } catch (e) {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Category already exists`;
  }
}
