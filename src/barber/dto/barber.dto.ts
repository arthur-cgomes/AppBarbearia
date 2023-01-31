import { OmitType } from '@nestjs/swagger';
import { Barber } from '../entity/barber.entity';

export class BarberDto extends OmitType(Barber, ['barbershop', 'scheduling']) {}
