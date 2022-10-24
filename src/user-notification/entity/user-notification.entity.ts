import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseCollection } from '../../common/entity/base.entity';
import { Notification } from '../../notification/entity/notification.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class UserNotification extends BaseCollection {
    @ApiProperty()
    @Column({ type: 'bool', name: 'read', default: false })
    read: boolean;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.usernotifications)
    user: User;

    @ApiProperty({ type: () => Notification })
    @ManyToOne(
        () => Notification,
        (notification) => notification.usernotifications,
    )
    notification: Notification;
}