import { ApiProperty } from '@nestjs/swagger';
import { Barber } from '../entity/barber.entity';
import { BarberDto } from './barber.dto';

export class GetAllBarbersResponseDto {
  @ApiProperty({
    description: 'Total de serviços que correspondem aos critérios',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description:
      'A posição atual no conjunto de resultados, ou nula se não houver mais resultados',
    example: 5,
    nullable: true,
  })
  skip: number | null;

  @ApiProperty({
    type: BarberDto,
    isArray: true,
    description: 'A lista de barbeiros',
  })
  barbers: Barber[];
}
