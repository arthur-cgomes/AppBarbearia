import { OmitType } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';

export class UserTypeDto extends OmitType(UserType, ['users']) {}
