import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { Notification } from '../notification/entity/notification.entity';
import { User } from '../user/entity/user.entity';
import { GetAllUserNotificationsResponseDto } from './dto/get-all-user-notification.dto';
import { UserNotification } from './entity/user-notification.entity';

@Injectable()
export class UserNotificationService {
    constructor(
        @InjectRepository(UserNotification)
        private readonly userNotificationRepository: Repository<UserNotification>,
    ) { }

    public async createUserNotifications(
        notification: Notification,
        toUsers: User[],
    ): Promise<void> {
        for (const user of toUsers) {
            const userNotification = new UserNotification();
            userNotification.user = user;
            userNotification.notification = notification;

            await this.userNotificationRepository.create(userNotification).save();
        }
    }

    public async updateUserNotificationRead(
        id: string,
    ): Promise<UserNotification> {
        const usernotification = await this.userNotificationRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!usernotification)
            throw new BadRequestException('user notification not found');

        return await (
            await this.userNotificationRepository.preload({
                id: usernotification.id,
                ...{ read: true },
            })
        ).save();
    }

    public async getUserNotificationById(id: string): Promise<UserNotification> {
        const notification = await this.userNotificationRepository.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException('notification with this id not found');
        }

        return notification;
    }

    public async getUserNotificationByIds(
        ids: string[],
    ): Promise<UserNotification[]> {
        return await this.userNotificationRepository.findBy({ id: In(ids) });
    }

    public async getAllUsersNotification(
        take: number,
        skip: number,
        read: boolean,
        userId: string,
        title?: string,
    ): Promise<GetAllUserNotificationsResponseDto> {
        const conditions: FindManyOptions<UserNotification> = {
            take,
            skip,
        };

        if (read) {
            conditions.where = { read };
        } else if (userId) {
            conditions.where = { user: { id: userId } };
        } else if (title) {
            conditions.where = { id: ILike('%' + title + '%') };
        }

        const [usernotifications, count] =
            await this.userNotificationRepository.findAndCount(conditions);

        if (usernotifications.length == 0) {
            return { skip: null, total: 0, usernotifications };
        }
        const over = count - Number(take) - Number(skip);
        skip = over <= 0 ? null : Number(skip) + Number(take);

        return { skip, total: count, usernotifications };
    }
}