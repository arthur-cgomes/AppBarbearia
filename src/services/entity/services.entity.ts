import { BaseCollection } from '../../common/entity/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Services extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 200 })
  name: string;

  @ApiProperty()
  @Column({ name: 'service type', length: 50 })
  type: string;

  @ApiProperty()
  @Column()
  value: string;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.services)
  user: User[];
}
