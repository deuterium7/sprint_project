import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BrandsService } from '../brands.service';

@ValidatorConstraint({ name: 'BrandAlreadyExists', async: true })
@Injectable()
export class BrandAlreadyExists implements ValidatorConstraintInterface {
  constructor(private brandsService: BrandsService) {}

  async validate(value: string) {
    try {
      const brand = await this.brandsService.findOneByName(value);
      return !brand;
    } catch (e) {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Brand is a already exists`;
  }
}
