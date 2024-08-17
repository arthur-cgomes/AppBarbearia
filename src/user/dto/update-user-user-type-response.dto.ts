import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserTypeDto } from '../../user-type/dto/user-type.dto';
import { User } from '../entity/user.entity';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserUserTypeDto extends OmitType(User, [
  'barbershops',
  'schedulings',
]) {
  @ApiProperty({ type: UserTypeDto, isArray: true })
  @IsNotEmpty()
  userTypes: [UserTypeDto];
}
