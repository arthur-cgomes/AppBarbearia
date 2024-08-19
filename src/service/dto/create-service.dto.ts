import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ServiceType } from '../../common/enum/service-type.enum';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Tipo do serviço',
    type: 'enum',
  })
  @IsNotEmpty()
  @IsEnum({ type: 'enum', enum: ServiceType })
  type: ServiceType;

  @ApiProperty({
    description: 'Valor do serviço',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Id da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  barberShopId: string;
}
