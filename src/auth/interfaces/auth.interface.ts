import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayload {
  @ApiProperty({
    description: 'Email do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
