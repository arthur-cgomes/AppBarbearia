import { ApiProperty } from '@nestjs/swagger';
import { BarberShop } from '../entity/barber-shop.entity';

export class GetAllBarberShopResponseDto {
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
    type: BarberShop,
    isArray: true,
    description: 'A lista de barbearias',
  })
  barbershops: BarberShop[];
}
