import { ApiProperty } from '@nestjs/swagger';
import { Services } from '../entity/services.entity';

export class GetAllServicesResponseDto {
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
    type: Services,
    isArray: true,
    description: 'A lista de serviços',
  })
  services: Services[];
}
