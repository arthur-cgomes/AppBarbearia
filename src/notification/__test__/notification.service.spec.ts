import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { UserNotification } from '../../user-notification/entity/user-notification.entity';
import { UserNotificationService } from '../../user-notification/user-notification.service';
import { UserType } from '../../user-type/entity/user-type.entity';
import { UserTypeService } from '../../user-type/user-type.service';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/user.service';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { Notification } from '../entity/notification.entity';
import { NotificationService } from '../notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let usernotificationService: UserNotificationService;
  let repositoryMock: MockRepository<Repository<Notification>>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: repositoryMockFactory<Notification>(),
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory<User>(),
        },
        UserNotificationService,
        {
          provide: getRepositoryToken(UserNotification),
          useValue: repositoryMockFactory<UserNotification>(),
        },
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useValue: repositoryMockFactory<UserType>(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    service = module.get<NotificationService>(NotificationService);
    usernotificationService = module.get<UserNotificationService>(
      UserNotificationService,
    );
    repositoryMock = module.get(getRepositoryToken(Notification));
  });

  beforeEach(() => jest.clearAllMocks());

  const notification: Notification = {
    id: '12313123-123123a-asdadsa',
    title: 'title',
    message: 'message',
    active: true,
    user: {
      id: '12313123-123123a-asdad',
    },
  } as Notification;

  const user: User = {
    id: '12313123-123123a-asdad',
    email: 'email@teste.com',
    password: 'password',
    name: 'name',
    birthDate: new Date(),
    phone: '(99)12341-2301',
  } as User;

  describe('createNotification', () => {
    const createNotificationDto: CreateNotificationDto = {
      title: 'title',
      message: 'message',
      toUsersIds: ['12313123-123123a-asdad'],
    };

    it('Should successfully a create notification', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.findBy = jest.fn((user) => user);
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => notification });

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest.spyOn(userService, 'getUserByIds').mockResolvedValue([user]);
      jest
        .spyOn(usernotificationService, 'createUserNotifications')
        .mockResolvedValue();
      const result = await service.createNotification(
        user.id,
        createNotificationDto,
      );

      expect(result).toStrictEqual(notification);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createNotificationDto,
        user,
      });
    });

    it('Should throw the BadRequestException exception toUsersIds list has some invalid id', async () => {
      const error = new BadRequestException(
        'toUsersIds list has some invalid id',
      );

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest.spyOn(userService, 'getUserByIds').mockResolvedValue([]);
      repositoryMock.findOne = jest.fn();

      await expect(
        service.createNotification(user.id, createNotificationDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('Should throw error a create notification', async () => {
      const error = new InternalServerErrorException('Generic error');

      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => notification });

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest.spyOn(userService, 'getUserByIds').mockResolvedValue([user]);

      jest
        .spyOn(usernotificationService, 'createUserNotifications')
        .mockRejectedValue(error);

      await expect(
        service.createNotification(user.id, createNotificationDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createNotificationDto,
        user,
      });
    });
  });

  describe('updateNotification', () => {
    const updateNotificationDto: UpdateNotificationDto = {
      externalId: user.id,
      title: 'Tests',
      message: 'Test of update',
    };

    it('Should successfully update a notification', async () => {
      repositoryMock.findOne.mockResolvedValueOnce(notification);
      repositoryMock.preload.mockResolvedValueOnce({
        save: () => notification,
      });

      const result = await service.updateNotification(
        notification.id,
        updateNotificationDto,
      );

      expect(result).toStrictEqual(notification);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: notification.id,
        ...updateNotificationDto,
      });
    });

    it('Should throw the NotFoundException exception when notification not found', async () => {
      const error = new NotFoundException(
        'notification with this id not found',
      );

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateNotification(notification.id, updateNotificationDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getNotificationById', () => {
    it('Should successfully get a notification by id', async () => {
      repositoryMock.findOne.mockResolvedValue(notification);

      const result = await service.getNotificationById(notification.id);

      expect(result).toStrictEqual(notification);
    });

    it('Should throw a NotFoundException if notification does not exist', async () => {
      const error = new NotFoundException(
        'notification with this id not found',
      );

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getNotificationById(notification.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getAllNotification', () => {
    it('Should successfully get all notifications', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<Notification> = {
        take,
        skip,
      };
      repositoryMock.findAndCount.mockResolvedValue([[notification], 10]);

      const result = await service.getAllNotification(take, skip, null);

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        notification: [notification],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
    it('Should successfully get all notifications with userId', async () => {
      const userId = 'userId';
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<Notification> = {
        take,
        skip,
        where: { user: { id: userId } },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[notification], 10]);

      const result = await service.getAllNotification(take, skip, userId, null);

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        notification: [notification],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all notifications with title', async () => {
      const title = 'title';
      const take = 10;
      const skip = 0;

      const conditions: FindManyOptions<Notification> = {
        take,
        skip,
        where: { title: ILike('%' + title + '%') },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[notification], 10]);

      const result = await service.getAllNotification(take, skip, null, title);

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        notification: [notification],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of notifications', async () => {
      const take = 10;
      const skip = 10;
      const conditions: FindManyOptions<Notification> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllNotification(take, skip, null);

      expect(result).toStrictEqual({ skip: null, total: 0, notification: [] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteNotification', () => {
    it('Should successfully delete a notification', async () => {
      repositoryMock.findOne.mockResolvedValue(notification);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteNotification(notification.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw the NotFoundException exception when notification not found', async () => {
      const error = new NotFoundException(
        'notification with this id not found',
      );

      repositoryMock.findOne = jest.fn();

      await expect(
        service.deleteNotification(notification.id),
      ).rejects.toStrictEqual(error);
    });
  });
});
