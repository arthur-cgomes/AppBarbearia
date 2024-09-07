import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Max } from 'class-validator';

export class CreateBarberDto {
  @ApiProperty({
    description: 'Nome do barbeiro',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'CPF do barbeiro',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Max(11)
  document: string;

  @ApiProperty({
    description: 'Email do barbeiro',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de celular do barbeiro',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  cellphone: string;

  @ApiProperty({
    description: 'Id da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  barbershopId: string;
}
