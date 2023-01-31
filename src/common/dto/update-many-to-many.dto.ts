import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateManyToManyDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  toAdd: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  toRemove: string[];
}
