import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BrandsService } from '../brands.service';

@ValidatorConstraint({ name: 'BrandExists', async: true })
@Injectable()
export class BrandExists implements ValidatorConstraintInterface {
  constructor(private brandsService: BrandsService) {}

  async validate(value: number) {
    try {
      const brand = await this.brandsService.findOne(value);
      return Boolean(brand);
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Brand doesn't exist`;
  }
}
