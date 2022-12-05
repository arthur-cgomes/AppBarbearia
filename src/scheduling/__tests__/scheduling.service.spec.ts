import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { FindManyOptions, Repository } from 'typeorm';
import { Scheduling } from '../entity/scheduling.entity';
import { SchedulingService } from '../scheduling.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../user/user.service';
import { BarberShopService } from '../../barber-shop/barber-shop.service';
import { ServicesService } from '../../services/services.service';
import { User } from '../../user/entity/user.entity';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { Service } from '../../services/entity/services.entity';

describe('SchedulingService', () => {
  let service: SchedulingService;

  let repositoryMock: MockRepository<Repository<Scheduling>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulingService,
        {
          provide: getRepositoryToken(Scheduling),
          useValue: repositoryMockFactory<Scheduling>(),
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory<User>(),
        },
        BarberShopService,
        {
          provide: getRepositoryToken(BarberShop),
          useValue: repositoryMockFactory<BarberShop>(),
        },
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: repositoryMockFactory<Service>(),
        },
      ],
    }).compile();

    service = module.get<SchedulingService>(SchedulingService);

    repositoryMock = module.get(getRepositoryToken(Scheduling));
  });

  beforeEach(() => jest.clearAllMocks());

  const users: User = {
    id: '12313123-123123a-abcde',
    email: 'email@teste.com.br',
    name: 'Arthur Gomes',
    birthDate: new Date(),
    phone: '(99)12341-2222',
  } as User;

  const barbershops: BarberShop = {
    id: '12314-121454-ç687ih',
    name: 'Teste',
    active: true,
  } as BarberShop;

  const services: Service = {
    name: 'name',
    type: 'type',
    value: 'value',
  } as Service;

  const scheduling: Scheduling = {
    date: new Date(),
    users,
    barbershops,
    services,
  } as Scheduling;

  describe('getSchedulingById', () => {
    it('Should successfully get scheduling by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(scheduling);

      const result = await service.getSchedulingById(scheduling.id);

      expect(result).toStrictEqual(scheduling);
    });

    it('Should throw the NotFoundException exception scheduling not found', async () => {
      const error = new NotFoundException('scheduling with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getSchedulingById(scheduling.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getAllScheduling', () => {
    it('Should successfully get all a scheduling', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<Scheduling> = {
        take,
        skip,
      };
      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[scheduling], 10]);

      const result = await service.getAllScheduling(take, skip, null, null);
      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        schedulings: [scheduling],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all scheduling with userId', async () => {
      const userId = 'userId';
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<Scheduling> = {
        take,
        skip,
        where: { id: userId },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[scheduling], 10]);

      const result = await service.getAllScheduling(take, skip, userId, null);

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        schedulings: [scheduling],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all scheduling with schedulingId', async () => {
      const schedulingId = 'schedulingId';
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<Scheduling> = {
        take,
        skip,
        where: { id: schedulingId },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[scheduling], 10]);

      const result = await service.getAllScheduling(
        take,
        skip,
        null,
        schedulingId,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        schedulings: [scheduling],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of scheduling', async () => {
      const take = 10;
      const skip = 10;

      const conditions: FindManyOptions<Scheduling> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllScheduling(take, skip, null, null);

      expect(result).toStrictEqual({
        skip: null,
        total: 0,
        schedulings: [],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteScheduling', () => {
    it('Should successfully delete a scheduling', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(scheduling);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteScheduling(scheduling.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw the NotFoundException exception when scheduling not found', async () => {
      const error = new NotFoundException('scheduling with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.deleteScheduling(scheduling.id),
      ).rejects.toStrictEqual(error);
    });
  });
});
