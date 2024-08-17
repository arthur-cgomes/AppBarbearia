import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateBarberShopDto {
  @ApiProperty({
    description: 'Nome da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'CNPJ da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Endereço da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Latitude da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  lat: string;

  @ApiProperty({
    description: 'Longitude da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  long: string;

  @ApiProperty({
    description: 'Número da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  cellphone: string;

  @ApiProperty({
    description: 'Email da barbearia',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
