import { OmitType } from '@nestjs/swagger';
import { Scheduling } from '../entity/scheduling.entity';

export class SchedulingDto extends OmitType(Scheduling, [
  'user',
  'barbershops',
  'services',
]) {}
