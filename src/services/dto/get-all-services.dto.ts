import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../entity/services.entity';

export class GetAllServicesResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: Service, isArray: true })
  services: Service[];
}
