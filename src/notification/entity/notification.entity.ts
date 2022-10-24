import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseCollection } from '../../common/entity/base.entity';
import { User } from '../../user/entity/user.entity';
import { UserNotification } from '../../user-notification/entity/user-notification.entity';


@Entity()
export class Notification extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 200 })
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ApiProperty({ type: () => UserNotification })
  @OneToMany(
    () => UserNotification,
    (usernotification) => usernotification.notification,
  )
  usernotifications: UserNotification[];
}
