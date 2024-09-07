import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateBarberShopDto {
  @ApiProperty({
    description: 'Nome da barbearia',
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'CNPJ da barbearia',
    type: String,
  })
  @IsOptional()
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Endereço da barbearia',
    type: String,
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Latitude da barbearia',
    type: String,
  })
  @IsOptional()
  @IsString()
  lat: string;

  @ApiProperty({
    description: 'Longitude da barbearia',
    type: String,
  })
  @IsOptional()
  @IsString()
  long: string;

  @ApiProperty({
    description: 'Número da barbearia',
    type: String,
  })
  @IsOptional()
  @IsString()
  cellphone: string;

  @ApiProperty({
    description: 'Email da barbearia',
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email: string;
}
