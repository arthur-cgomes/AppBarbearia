import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserTypeEnum } from '../../common/enum/user-type.enum';

export class CreateUserTypeDto {
  @ApiProperty({
    description: 'Nome do tipo de usuário',
    type: 'Enum',
  })
  @IsNotEmpty()
  name: UserTypeEnum;
}
