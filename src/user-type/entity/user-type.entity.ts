import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseCollection } from '../../common/entity/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class UserType extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 150 })
  name: string;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.userTypes)
  users: User[];
}
