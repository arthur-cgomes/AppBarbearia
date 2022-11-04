import { ApiProperty } from '@nestjs/swagger';

export class GetAllBarberShopResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  //quando fizer o relacionamento, adicionar o retorno do relacionamento (em array [] )
}
