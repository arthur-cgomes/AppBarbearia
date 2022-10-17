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
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: MockRepository<Repository<User>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory<User>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

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
      const error = new ConflictException(
        'user already exists',
      );

      repositoryMock.findOne = jest.fn().mockReturnValue(user);

      await expect(
        service.createUser(createUserDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Arthur Gomes',
      birthDate: new Date(),
      phone: '(99)12341-4444',
    };

    it('Should successfully update a user', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(user);
      repositoryMock.preload = jest.fn().mockReturnValue({ save: () => user });

      const result = await service.updateUser(
        user.id,
        updateUserDto,
      );

      expect(result).toStrictEqual(user);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: user.id,
        ...updateUserDto,
      });
    });

    it('Should throw the NotFoundException exception when user not found', async () => {
      const error = new NotFoundException(
        'user not found',
      );

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUser(user.id, updateUserDto),
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
});