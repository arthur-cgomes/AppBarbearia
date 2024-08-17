import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';
import { UserTypeDto } from './user-type.dto';

export class GetAllUserTypesResponseDto {
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
    type: UserTypeDto,
    isArray: true,
    description: 'A lista de tipos de usuários',
  })
  usertypes: UserType[];
}
