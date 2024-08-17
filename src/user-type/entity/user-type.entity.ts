import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserTypeEnum } from '../../common/enum/user-type.enum';
import { User } from '../../user/entity/user.entity';

@Entity()
export class UserType extends BaseCollection {
  @ApiProperty({
    description: 'Nome do tipo de usuário',
    type: 'Enum',
  })
  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.USER,
    nullable: true,
  })
  name: UserTypeEnum;

  @ApiProperty({
    description: 'Relacionamento com a tabela User',
    type: () => User,
  })
  @OneToMany(() => User, (user) => user.userType)
  user: User[];
}
