import { ApiProperty } from '@nestjs/swagger';

export class OkResponseDto {
  @ApiProperty({
    description: 'Retorno padrão',
    type: String,
    example: 'Ok',
  })
  message: string;
}
