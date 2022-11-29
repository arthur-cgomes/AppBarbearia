import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBarberShopDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
