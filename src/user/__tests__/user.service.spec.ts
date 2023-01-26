import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserTypeService } from '../../user-type/user-type.service';
import { UserType } from '../../user-type/entity/user-type.entity';
import { UpdateManyToManyDto } from 'src/common/dto/update-many-to-many.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

describe('UserService', () => {
  let service: UserService;
  let userTypeService: UserTypeService;
  let repositoryMock: MockRepository<Repository<User>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<UserService>(UserService);
    userTypeService = module.get<UserTypeService>(UserTypeService);

    repositoryMock = module.get(getRepositoryToken(User));
  });

  beforeEach(() => jest.clearAllMocks());

  const user: User = {
    id: '12313123-123123a-abcde',
    email: 'email@teste.com.br',
    name: 'Arthur Gomes',
    birthDate: new Date(),
    phone: '(99)12341-2222',
  } as User;

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'email@teste.com.br',
      password: '123456',
      name: 'Arthur Gomes',
      birthDate: new Date(),
      phone: '(99)12341-2222',
    };

    it('Should successfully create user', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest.fn().mockReturnValue({ save: () => user });

      const result = await service.createUser(createUserDto);

      expect(result).toStrictEqual(user);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createUserDto,
      });
    });

    it('Should throw the ConflictException exception when user already exists', async () => {
      const error = new ConflictException('user already exists');

      repositoryMock.findOne = jest.fn().mockReturnValue(user);

      await expect(service.createUser(createUserDto)).rejects.toStrictEqual(
        error,
      );
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Arthur Gomes',
      birthDate: new Date(),
      phone: '(99)12341-4444',
      email: 'email',
    };

    it('Should successfully update a user', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(user);
      repositoryMock.preload = jest.fn().mockReturnValue({ save: () => user });

      const result = await service.updateUser(user.id, updateUserDto);

      expect(result).toStrictEqual(user);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: user.id,
        ...updateUserDto,
      });
    });

    it('Should throw the NotFoundException exception when user not found', async () => {
      const error = new NotFoundException('user not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUser(user.id, updateUserDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('updateUserType', () => {
    const toAddOrRemoveDto: UpdateManyToManyDto = {
      toAdd: ['b899140f-1b11-459b-b631-649777702d00'],
      toRemove: ['6fd2049a-b9ba-422f-b228-bc6e3ca251af'],
    };
    const userTypesToAdd = [
      {
        id: 'b899140f-1b11-459b-b631-649777702d00',
        name: 'will be add',
      },
    ] as UserType[];

    it('Should successfully update a user`s userTypes', async () => {
      user.userTypes = [
        {
          id: '1as4540f-1b11-459b-b631-649hdgat1759',
          name: 'will be kept',
        },
        {
          id: '6fd2049a-b9ba-422f-b228-bc6e3ca251af',
          name: 'will be removed',
        },
      ] as UserType[];

      jest
        .spyOn(userTypeService, 'getUserTypesByIds')
        .mockResolvedValue(userTypesToAdd);
      repositoryMock.findOne = jest.fn().mockResolvedValue(user);
      repositoryMock.preload = jest
        .fn()
        .mockResolvedValue({ save: () => user });

      const result = await service.updateUserType(user.id, toAddOrRemoveDto);
      expect(result).toStrictEqual(user);
      expect(result.userTypes).toStrictEqual([
        {
          id: '1as4540f-1b11-459b-b631-649hdgat1759',
          name: 'will be kept',
        },
        {
          id: 'b899140f-1b11-459b-b631-649777702d00',
          name: 'will be add',
        },
      ] as UserType[]);
      expect(repositoryMock.preload).toHaveBeenCalledWith(user);
    });

    it('Should throw the NotFoundException exception when the user not found', async () => {
      const error = new NotFoundException(
        'user with this externalId not found',
      );

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUserType(user.id, toAddOrRemoveDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });

    it('Should throw the BadRequestException exception when the list is invalid', async () => {
      const error = new BadRequestException('toAdd list has some invalid id');

      jest.spyOn(userTypeService, 'getUserTypesByIds').mockResolvedValue([]);
      repositoryMock.findOne = jest.fn().mockResolvedValue(user);

      await expect(
        service.updateUserType(user.id, toAddOrRemoveDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('Should successfully get a user by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(user);

      const result = await service.getUserById(user.id);

      expect(result).toStrictEqual(user);
    });

    it('Should throw the NotFoundException exception when user id not found', async () => {
      const error = new NotFoundException('user with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.getUserById(user.id)).rejects.toStrictEqual(error);
    });
  });

  describe('getUserByIds', () => {
    it('Should successfully get users by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([user]);

      const result = await service.getUserByIds([user.id]);

      expect(result).toStrictEqual([user]);
    });
  });

  describe('getAllUsers', () => {
    it('Should successfully get all users', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<User> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[user], 10]);

      const result = await service.getAllUsers(take, skip, null);

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        users: [user],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all user with userId', async () => {
      const userId = 'userId';
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<User> = {
        take,
        skip,
        where: { id: userId },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[user], 10]);

      const result = await service.getAllUsers(take, skip, userId);

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        users: [user],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of users', async () => {
      const take = 10;
      const skip = 10;
      const conditions: FindManyOptions<User> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllUsers(take, skip, null);

      expect(result).toStrictEqual({ skip: null, total: 0, users: [] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteUser', () => {
    it('Should successfully delete a user', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(user);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteUser(user.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw the NotFoundException exception when user id not found', async () => {
      const error = new NotFoundException('user with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.deleteUser(user.id)).rejects.toStrictEqual(error);
    });
  });
});
