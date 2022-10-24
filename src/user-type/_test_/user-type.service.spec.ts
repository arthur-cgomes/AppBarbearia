import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { CreateUserTypeDto } from '../dto/create-user-type.dto';
import { UpdateUserUserTypeDto } from '../dto/update-user-type.dto';
import { UserType } from '../entity/user-type.entity';
import { UserTypeService } from '../user-type.service';

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

  const userType: UserType = {
    name: 'name',
  } as UserType;

  describe('createUserType', () => {
    const createUserTypeDto: CreateUserTypeDto = {
      name: 'name',
    };

    it('Should successfully create a user type', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => userType });

      const result = await service.createUserType(createUserTypeDto);

      expect(result).toStrictEqual(userType);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createUserTypeDto,
      });
    });

    it('Should throw the ConflictException exception user type with that name already exists', async () => {
      const error = new ConflictException(
        'user type with that name already exists',
      );

      repositoryMock.findOne = jest.fn().mockResolvedValue(userType);

      await expect(
        service.createUserType(createUserTypeDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUserType', () => {
    const updateUserUserTypeDto: UpdateUserUserTypeDto = {
      name: 'name',
    };
    it('Should successfully update a user type', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(userType);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => userType });

      const result = await service.updateUserType(
        userType.id,
        updateUserUserTypeDto,
      );
      expect(result).toStrictEqual(userType);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: userType.id,
        ...updateUserUserTypeDto,
      });
    });

    it('Should throw the NotFoundException exception user type with this id not found', async () => {
      const error = new NotFoundException('user type with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateUserType(userType.id, updateUserUserTypeDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getUserTypeById', () => {
    it('Should successfully get a user type by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(userType);

      const result = await service.getUserTypeById(userType.id);

      expect(result).toStrictEqual(userType);
    });

    it('Should throw the NotFoundException exception user type with this id not found', async () => {
      const error = new NotFoundException('user type with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.getUserTypeById(userType.id)).rejects.toStrictEqual(
        error,
      );
    });
  });

  describe('getUserTypesByIds', () => {
    it('Should successfully get a user type by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([userType]);

      const result = await service.getUserTypesByIds([userType.id]);

      expect(result).toStrictEqual([userType]);
    });

    describe('getAllUserType', () => {
      it('Should successfully get all a user type', async () => {
        const take = 1;
        const skip = 0;
        const conditions: FindManyOptions<UserType> = {
          take,
          skip,
        };
        repositoryMock.findAndCount = jest
          .fn()
          .mockReturnValue([[userType], 10]);

        const result = await service.getAllUserType(take, skip, null);
        expect(result).toStrictEqual({
          skip: 1,
          total: 10,
          usertypes: [userType],
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
      });

      it('Should successfully get all user type with search', async () => {
        const search = 'aaa';
        const take = 10;
        const skip = 0;

        const conditions: FindManyOptions<UserType> = {
          take,
          skip,
          where: { name: ILike('%' + search + '%') },
        };

        repositoryMock.findAndCount = jest
          .fn()
          .mockReturnValue([[userType], 10]);

        const result = await service.getAllUserType(take, skip, search);

        expect(result).toStrictEqual({
          skip: null,
          total: 10,
          usertypes: [userType],
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
      });

      it('Should successfully return an empty list of user type', async () => {
        const take = 10;
        const skip = 10;

        const conditions: FindManyOptions<UserType> = {
          take,
          skip,
        };

        repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

        const result = await service.getAllUserType(take, skip, null);

        expect(result).toStrictEqual({
          skip: null,
          total: 0,
          usertypes: [],
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
      });
    });

    describe('deleteuserType', () => {
      it('Should successfully delete a user type', async () => {
        repositoryMock.findOne = jest.fn().mockReturnValue(userType);
        repositoryMock.remove = jest.fn();

        const result = await service.deleteUserType(userType.id);
        expect(result).toStrictEqual('removed');
      });

      it('Should throw the NotFoundException exception when user type with this id not found', async () => {
        const error = new NotFoundException('user type with this id not found');

        repositoryMock.findOne = jest.fn();

        await expect(service.deleteUserType(userType.id)).rejects.toStrictEqual(
          error,
        );
      });
    });
  });
});