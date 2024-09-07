import { OmitType } from '@nestjs/swagger';
import { Service } from '../entity/service.entity';

export class ServicesDto extends OmitType(Service, [
  'scheduling',
  'barberShop',
]) {}
