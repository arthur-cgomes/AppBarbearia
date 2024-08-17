import { OmitType } from '@nestjs/swagger';
import { Services } from '../entity/services.entity';

export class ServicesDto extends OmitType(Services, [
  'scheduling',
  'barberShop',
]) {}
