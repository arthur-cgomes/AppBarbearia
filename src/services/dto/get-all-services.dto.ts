import { ApiProperty } from '@nestjs/swagger';
import { Services } from '../entity/services.entity';

export class GetAllServicesResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: Services, isArray: true })
  services: Services[];
}
