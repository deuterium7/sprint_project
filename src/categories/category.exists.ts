import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategoriesService } from './categories.service';

@ValidatorConstraint({ name: 'CategoryExists', async: true })
@Injectable()
export class CategoryExistsRule implements ValidatorConstraintInterface {
  constructor(private categoriesService: CategoriesService) {}

  async validate(value: number) {
    try {
      const category = await this.categoriesService.findOne(value);
      return Boolean(category);
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Category doesn't exist`;
  }
}
