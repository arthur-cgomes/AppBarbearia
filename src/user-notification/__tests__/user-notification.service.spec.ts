import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { UserType } from '../../user-type/entity/user-type.entity';
import { UserTypeService } from '../../user-type/user-type.service';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/user.service';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { UserNotification } from '../entity/user-notification.entity';
import { UserNotificationService } from '../user-notification.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserNotificationService', () => {
  let service: UserNotificationService;
  let repositoryMock: MockRepository<Repository<UserNotification>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserNotificationService,
        {
          provide: getRepositoryToken(UserNotification),
          useValue: repositoryMockFactory<UserNotification>(),
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory<User>(),
        },
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useValue: repositoryMockFactory<UserType>(),
        },
      ],
    }).compile();

    service = module.get<UserNotificationService>(UserNotificationService);

    repositoryMock = module.get(getRepositoryToken(UserNotification));
  });

  beforeEach(() => jest.clearAllMocks());

  const userNotification: UserNotification = {
    read: true,
    user: {
      id: '12313123-123123a-asdad',
      email: 'email@teste.com',
      password: 'password',
      name: 'name',
      birthDate: new Date(),
      phone: '(99)12341-2301',
    },
    notification: {
      title: 'title',
      message: 'message',
    },
  } as UserNotification;

  const toUsers: User[] = [
    {
      id: '12313123-123123a-asdad',
      email: 'email@teste.com',
      password: 'password',
      name: 'name',
      birthDate: new Date(),
      phone: '(99)12341-2301',
    } as User,
  ];

  describe('createUserNotifications', () => {
    it('Should successfully a create user notification', async () => {
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => userNotification });

      const result = await service.createUserNotifications(
        userNotification.notification,
        toUsers,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('updateUserNotificationRead', () => {
    it('Should successfully update a user notification read', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(userNotification);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => userNotification });

      const result = await service.updateUserNotificationRead(
        userNotification.id,
      );

      expect(result).toStrictEqual(userNotification);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: userNotification.id,
        ...{ read: true },
      });
    });

    it('Should throw the NotFoundException exception when user notification not found', async () => {
      const error = new NotFoundException('user notification not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUserNotificationRead(userNotification.id),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });
  describe('getUserNotificationById', () => {
    it('Should successfully get a userNotification by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(userNotification);

      const result = await service.getUserNotificationById(userNotification.id);

      expect(result).toStrictEqual(userNotification);
    });

    it('Should throw the NotFoundException exception userNotification not found', async () => {
      const error = new NotFoundException(
        'notification with this id not found',
      );

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getUserNotificationById(userNotification.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getUserNotificationByIds', () => {
    it('Should successfully get a userNotification by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([userNotification]);

      const result = await service.getUserNotificationByIds([
        userNotification.id,
      ]);

      expect(result).toStrictEqual([userNotification]);
    });
  });

  describe('getAllUsersNotification', () => {
    it('Should successfully get all a userNotification', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<UserNotification> = {
        take,
        skip,
      };
      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[userNotification], 10]);

      const result = await service.getAllUsersNotification(
        take,
        skip,
        null,
        null,
        null,
      );
      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        usernotifications: [userNotification],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all userNotification with read', async () => {
      const take = 10;
      const skip = 0;
      const read = true;

      const conditions: FindManyOptions<UserNotification> = {
        take,
        skip,
        where: { read },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[userNotification], 10]);

      const result = await service.getAllUsersNotification(
        take,
        skip,
        read,
        null,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        usernotifications: [userNotification],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all userNotification with userId', async () => {
      const take = 10;
      const skip = 0;
      const userId = 'userId';

      const conditions: FindManyOptions<UserNotification> = {
        take,
        skip,
        where: { user: { id: userId } },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[userNotification], 10]);

      const result = await service.getAllUsersNotification(
        take,
        skip,
        null,
        userId,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        usernotifications: [userNotification],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all userNotification with title', async () => {
      const take = 10;
      const skip = 0;
      const title = 'title';

      const conditions: FindManyOptions<UserNotification> = {
        take,
        skip,
        where: { id: ILike('%' + title + '%') },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[userNotification], 10]);

      const result = await service.getAllUsersNotification(
        take,
        skip,
        null,
        null,
        title,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        usernotifications: [userNotification],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of userNotification', async () => {
      const take = 10;
      const skip = 10;
      const conditions: FindManyOptions<UserNotification> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllUsersNotification(
        take,
        skip,
        null,
        null,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 0,
        usernotifications: [],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });
});
