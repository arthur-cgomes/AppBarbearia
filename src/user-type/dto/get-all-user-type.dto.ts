import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';
import { UserTypeDto } from './user-type.dto';

export class GetAllUserTypesResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: UserTypeDto, isArray: true })
  usertypes: UserType[];
}
