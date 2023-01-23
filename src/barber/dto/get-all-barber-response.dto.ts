import { ApiProperty } from '@nestjs/swagger';
import { Barber } from '../entity/barber.entity';
import { BarberDto } from './barber.dto';

export class GetAllBarberResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: BarberDto, isArray: true })
  barber: Barber[];
}
