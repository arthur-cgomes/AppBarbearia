import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../entity/service.entity';

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
    type: Service,
    isArray: true,
    description: 'A lista de serviços',
  })
  services: Service[];
}
