import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  birthdate: Date;

  @ApiProperty({
    description: 'Email do usuário',
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de celular do usuário',
    type: String,
  })
  @IsOptional()
  @IsString()
  cellphone: string;
}
