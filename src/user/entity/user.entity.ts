import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseCollection } from '../../common/entity/base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserType } from '../../user-type/entity/user-type.entity';
import { Notification } from '../../notification/entity/notification.entity';

@Entity()
@Unique(['email'])
export class User extends BaseCollection {
  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({ default: null, select: false })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 150 })
  name: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: null })
  birthDate: Date;

  @ApiProperty()
  @Column({ length: 20, default: null })
  phone: string;

  @ApiProperty({ type: () => UserType })
  @ManyToMany(() => UserType, (usertype) => usertype.user)
  @JoinTable({ name: 'user_user_type' })
  userTypes: UserType[];

  @ApiProperty({ type: () => Notification })
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  checkPassword = (attempt: string) => {
    if (!this.password) return false;
    return bcrypt.compareSync(attempt, this.password);
  };

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
