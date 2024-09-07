import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Max } from 'class-validator';

export class UpdateBarberDto {
  @ApiProperty({
    description: 'Nome do barbeiro',
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'CPF do barbeiro',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Max(11)
  document: string;

  @ApiProperty({
    description: 'Email do barbeiro',
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de celular do barbeiro',
    type: String,
  })
  @IsOptional()
  @IsString()
  cellphone: string;

  @ApiProperty({
    description: 'Id da barbearia',
    type: String,
  })
  @IsOptional()
  @IsString()
  barbershopId: string;
}
