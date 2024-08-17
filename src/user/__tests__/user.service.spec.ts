import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../common/mock/test.util';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserTypeService } from '../../user-type/user-type.service';
import { UserType } from '../../user-type/entity/user-type.entity';
import { UpdateManyToManyDto } from 'src/common/dto/update-many-to-many.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { mockUser } from './mocks/user.mock';

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

  describe('checkUserToLogin', () => {
    it('Should successfully return user for a valid email', async () => {
      const email = 'email@agtecnologia.com.br';
      repositoryMock.findOne = jest.fn().mockReturnValue(mockUser);

      const result = await service.checkUserToLogin(mockUser.email);

      expect(result).toStrictEqual(mockUser);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
        select: ['id', 'email', 'password'],
      });
    });

    it('Should throw NotFoundException when user with email does not exist', async () => {
      const email = 'nonexistent@agtecnologia.com.br';

      repositoryMock.findOne = jest.fn().mockReturnValue(null);

      await expect(service.checkUserToLogin(email)).rejects.toThrow(
        new NotFoundException('user with this email not found'),
      );
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
        select: ['id', 'email', 'password'],
      });
    });
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'email@agtecnologia.com.br',
      password: 'password',
      name: 'Arthur Gomes',
      birthdate: new Date(),
      cellphone: '(31)98517-1031',
    };

    it('Should successfully create user', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => mockUser });

      const result = await service.createUser(createUserDto);

      expect(result).toStrictEqual(mockUser);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createUserDto,
      });
    });

    it('Should throw the ConflictException exception when user already exists', async () => {
      const error = new ConflictException('user already exists');

      repositoryMock.findOne = jest.fn().mockReturnValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toStrictEqual(
        error,
      );
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'email@agtecnologia.com.br',
      name: 'Arthur Gomes',
      birthdate: new Date(),
      cellphone: '(31)98517-1031',
    };

    it('Should successfully update a user', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockUser);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => mockUser });

      const result = await service.updateUser(mockUser.id, updateUserDto);

      expect(result).toStrictEqual(mockUser);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: mockUser.id,
        ...updateUserDto,
      });
    });

    it('Should throw the NotFoundException exception when user not found', async () => {
      const error = new NotFoundException('user not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUser(mockUser.id, updateUserDto),
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
      mockUser.userTypes = [
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
      repositoryMock.findOne = jest.fn().mockResolvedValue(mockUser);
      repositoryMock.preload = jest
        .fn()
        .mockResolvedValue({ save: () => mockUser });

      const result = await service.updateUserType(
        mockUser.id,
        toAddOrRemoveDto,
      );
      expect(result).toStrictEqual(mockUser);
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
      expect(repositoryMock.preload).toHaveBeenCalledWith(mockUser);
    });

    it('Should throw the NotFoundException exception when the user not found', async () => {
      const error = new NotFoundException(
        'user with this externalId not found',
      );

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUserType(mockUser.id, toAddOrRemoveDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });

    it('Should throw the BadRequestException exception when the list is invalid', async () => {
      const error = new BadRequestException('toAdd list has some invalid id');

      jest.spyOn(userTypeService, 'getUserTypesByIds').mockResolvedValue([]);
      repositoryMock.findOne = jest.fn().mockResolvedValue(mockUser);

      await expect(
        service.updateUserType(mockUser.id, toAddOrRemoveDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('Should successfully get a user by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockUser);

      const result = await service.getUserById(mockUser.id);

      expect(result).toStrictEqual(mockUser);
    });

    it('Should throw the NotFoundException exception when user id not found', async () => {
      const error = new NotFoundException('user with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.getUserById(mockUser.id)).rejects.toStrictEqual(
        error,
      );
    });
  });

  describe('getUserByIds', () => {
    it('Should successfully get users by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([mockUser]);

      const result = await service.getUserByIds([mockUser.id]);

      expect(result).toStrictEqual([mockUser]);
    });
  });

  describe('getAllUsers', () => {
    it('Should successfully get all users', async () => {
      const take = 1;
      const skip = 0;
      const search = '';
      const conditions: FindManyOptions<User> = {
        take,
        skip,
        order: expect.any(Object),
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[mockUser], 10]);

      const result = await service.getAllUsers(take, skip, search, '', 'ASC');

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        users: [mockUser],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all users with search', async () => {
      const search = 'search';
      const take = 10;
      const skip = 0;

      const conditions: FindManyOptions<User> = {
        take,
        skip,
        order: expect.any(Object),
        where: { name: ILike('%' + search + '%') },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[mockUser], 10]);

      const result = await service.getAllUsers(take, skip, search, '', 'ASC');

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        users: [mockUser],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of users', async () => {
      const take = 1;
      const skip = 0;
      const search = '';
      const conditions: FindManyOptions<User> = {
        take,
        skip,
        order: expect.any(Object),
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllUsers(take, skip, search, '', 'ASC');

      expect(result).toStrictEqual({ skip: null, total: 0, users: [] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteUserById', () => {
    it('Should successfully delete a user by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockUser);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteUserById(mockUser.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw the NotFoundException exception when user id not found', async () => {
      const error = new NotFoundException('user with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.deleteUserById(mockUser.id)).rejects.toStrictEqual(
        error,
      );
    });
  });
});
