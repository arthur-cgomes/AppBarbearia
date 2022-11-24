import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateBarberShopDto {
  @ApiProperty({ type: String })
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  cnpj: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsOptional()
  email: string;
}
