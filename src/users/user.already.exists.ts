import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from './users.service';

@ValidatorConstraint({ name: 'UserAlreadyExists', async: true })
@Injectable()
export class UserAlreadyExistsRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(value: string) {
    try {
      const user = await this.usersService.findOneByEmail(value);
      return !Boolean(user);
    } catch (e) {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `User already exist`;
  }
}
