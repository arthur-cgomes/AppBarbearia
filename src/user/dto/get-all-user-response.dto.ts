import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class GetAllUsersResponseDto {
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
    type: User,
    isArray: true,
    description: 'A lista de usuários',
  })
  users: User[];
}
