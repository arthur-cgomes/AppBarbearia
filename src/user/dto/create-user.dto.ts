import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário',
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  birthdate: Date;

  @ApiProperty({
    description: 'CPF do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Número de celular do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  cellphone: string;

  @ApiProperty({
    description: 'Tipo do usuário',
  })
  @IsNotEmpty()
  @IsString()
  userTypeId: string;
}
