import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateSchedulingDto {
  @ApiProperty({
    description: 'Id do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Id da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  barberShopId: string;

  @ApiProperty({
    description: 'Id do barbeiro',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  barberId: string;

  @ApiProperty({
    description: 'Id do serviço',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @ApiProperty({
    description: 'Data e hora do agendamento',
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
