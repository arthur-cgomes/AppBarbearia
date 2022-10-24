import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetAllNotificationsResponseDto } from './dto/get-all-notification-response.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entity/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  public async createNotification(
    id: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const user = await this.userService.getUserById(id);

    const toUsers = await this.userService.getUserByIds(
      createNotificationDto.toUsersIds,
    );
    if (toUsers.length !== createNotificationDto.toUsersIds.length)
      throw new BadRequestException('toUsersIds list has some invalid id');

    const notification = await this.notificationRepository
      .create({
        ...createNotificationDto,
        user,
      })
      .save();

    //try {
    //  await this.userNotificationService.createUserNotifications(
    //    notification,
    //    toUsers,
    //  );
    //  return notification;
    //} catch (err) {
    //  if (notification.id)
    //    await this.notificationRepository.remove(notification);
    //
    //  throw err;
    //}
  }

  public async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.getNotificationById(id);

    return await (
      await this.notificationRepository.preload({
        id,
        ...updateNotificationDto,
      })
    ).save();
  }

  public async getNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification)
      throw new NotFoundException('notification with this id not found');

    return notification;
  }

  public async getAllNotification(
    take: number,
    skip: number,
    userId: string,
    title?: string,
  ): Promise<GetAllNotificationsResponseDto> {
    const conditions: FindManyOptions<Notification> = {
      take,
      skip,
    };

    if (userId) {
      conditions.where = { user: { id: userId } };
    } else if (title) {
      conditions.where = { title: ILike('%' + title + '%') };
    }

    const [notification, count] =
      await this.notificationRepository.findAndCount(conditions);

    if (notification.length == 0) {
      return { skip: null, total: 0, notification };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, notification };
  }

  public async deleteNotification(id: string): Promise<string> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification)
      throw new NotFoundException('notification with this id not found');

    await this.notificationRepository.remove(notification);

    return 'removed';
  }
}
