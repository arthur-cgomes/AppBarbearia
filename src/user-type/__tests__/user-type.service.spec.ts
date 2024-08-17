import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../common/mock/test.util';
import { CreateUserTypeDto } from '../dto/create-user-type.dto';
import { UpdateUserUserTypeDto } from '../dto/update-user-type.dto';
import { UserType } from '../entity/user-type.entity';
import { UserTypeService } from '../user-type.service';
import { mockUserType } from './mocks/user-type.mock';
import { UserTypeEnum } from '../../common/enum/user-type.enum';

describe('UserTypeService', () => {
  let service: UserTypeService;
  let repositoryMock: MockRepository<Repository<UserType>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useValue: repositoryMockFactory<UserType>(),
        },
      ],
    }).compile();

    service = module.get<UserTypeService>(UserTypeService);

    repositoryMock = module.get(getRepositoryToken(UserType));
  });

  beforeEach(() => jest.resetAllMocks());

  describe('createUserType', () => {
    const createUserTypeDto: CreateUserTypeDto = {
      name: UserTypeEnum.USER,
    };

    it('Should successfully create a user type', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => mockUserType });

      const result = await service.createUserType(createUserTypeDto);

      expect(result).toStrictEqual(mockUserType);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createUserTypeDto,
      });
    });

    it('Should throw the ConflictException exception user type with that name already exists', async () => {
      const error = new ConflictException(
        'user type with that name already exists',
      );

      repositoryMock.findOne = jest.fn().mockResolvedValue(mockUserType);

      await expect(
        service.createUserType(createUserTypeDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUserType', () => {
    const updateUserUserTypeDto: UpdateUserUserTypeDto = {
      name: UserTypeEnum.USER,
    };
    it('Should successfully update a user type', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockUserType);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => mockUserType });

      const result = await service.updateUserType(
        mockUserType.id,
        updateUserUserTypeDto,
      );
      expect(result).toStrictEqual(mockUserType);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: mockUserType.id,
        ...updateUserUserTypeDto,
      });
    });

    it('Should throw the NotFoundException exception user type with this id not found', async () => {
      const error = new NotFoundException('user type with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUserType(mockUserType.id, updateUserUserTypeDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getUserTypeById', () => {
    it('Should successfully get a user type by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockUserType);

      const result = await service.getUserTypeById(mockUserType.id);

      expect(result).toStrictEqual(mockUserType);
    });

    it('Should throw the NotFoundException exception user type with this id not found', async () => {
      const error = new NotFoundException('user type with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getUserTypeById(mockUserType.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getUserTypesByIds', () => {
    it('Should successfully get a user type by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([mockUserType]);

      const result = await service.getUserTypesByIds([mockUserType.id]);

      expect(result).toStrictEqual([mockUserType]);
    });

    describe('getAllUserType', () => {
      it('Should successfully get all a user type', async () => {
        const take = 1;
        const skip = 0;
        const search = '';

        const conditions: FindManyOptions<UserType> = {
          take,
          skip,
        };
        repositoryMock.findAndCount = jest
          .fn()
          .mockReturnValue([[mockUserType], 10]);

        const result = await service.getAllUserTypes(take, skip, search);
        expect(result).toStrictEqual({
          skip: 1,
          total: 10,
          usertypes: [mockUserType],
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
      });

      it('Should successfully get all user types with search', async () => {
        const search = 'user';
        const take = 10;
        const skip = 0;

        repositoryMock.findAndCount = jest
          .fn()
          .mockReturnValue([[mockUserType], 1]);

        const result = await service.getAllUserTypes(take, skip, search);

        const filteredUserTypes = result.usertypes.filter((ut) =>
          String(ut.name).toLowerCase().includes(search.toLowerCase()),
        );

        expect(result).toStrictEqual({
          skip: null,
          total: filteredUserTypes.length,
          usertypes: filteredUserTypes,
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
          take,
          skip,
          where: { name: UserTypeEnum.USER },
        });
      });

      it('Should successfully return an empty list of user type', async () => {
        const take = 10;
        const skip = 10;
        const search = '';

        const conditions: FindManyOptions<UserType> = {
          take,
          skip,
        };

        repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

        const result = await service.getAllUserTypes(take, skip, search);

        expect(result).toStrictEqual({
          skip: null,
          total: 0,
          usertypes: [],
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
      });
    });

    describe('deleteUserTypeById', () => {
      it('Should successfully delete a user type by id', async () => {
        repositoryMock.findOne = jest.fn().mockReturnValue(mockUserType);
        repositoryMock.remove = jest.fn();

        const result = await service.deleteUserTypeById(mockUserType.id);
        expect(result).toStrictEqual('removed');
      });

      it('Should throw the NotFoundException exception when user type with this id not found', async () => {
        const error = new NotFoundException('user type with this id not found');

        repositoryMock.findOne = jest.fn();

        await expect(
          service.deleteUserTypeById(mockUserType.id),
        ).rejects.toStrictEqual(error);
      });
    });
  });
});
