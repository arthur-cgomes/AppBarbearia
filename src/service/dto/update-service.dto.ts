import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceType } from '../../common/enum/service-type.enum';

export class UpdateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Tipo do serviço',
    type: 'enum',
  })
  @IsOptional()
  @IsEnum({ type: 'enum', enum: ServiceType })
  type: ServiceType;

  @ApiProperty({
    description: 'Valor do serviço',
    type: String,
  })
  @IsOptional()
  @IsString()
  value: string;
}
