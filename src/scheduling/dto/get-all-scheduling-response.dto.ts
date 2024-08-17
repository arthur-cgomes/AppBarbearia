import { ApiProperty } from '@nestjs/swagger';
import { Scheduling } from '../entity/scheduling.entity';
import { SchedulingDto } from './scheduling.dto';

export class GetAllSchedulingResponseDto {
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
    type: SchedulingDto,
    isArray: true,
    description: 'A lista de agendamentos',
  })
  schedulings: Scheduling[];
}
