import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserTypeDto } from '../../user-type/dto/user-type.dto';
import { User } from '../entity/user.entity';

export class UpdateUserUserTypeDto extends OmitType(User, [
  'userTypes',
  'notifications',
  'usernotifications',
]) {
  @ApiProperty({ type: UserTypeDto, isArray: true })
  userTypes: [UserTypeDto];
}
