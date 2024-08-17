import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateManyToManyDto {
  @ApiProperty({
    description: 'Usuários a adicionar',
    type: [String],
  })
  @IsArray()
  toAdd: string[];

  @ApiProperty({
    description: 'Usuários a remover',
    type: [String],
  })
  @IsArray()
  toRemove: string[];
}
