import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../common/mock/test.util';
import { FindManyOptions, Repository } from 'typeorm';
import { Scheduling } from '../entity/scheduling.entity';
import { SchedulingService } from '../scheduling.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../user/user.service';
import { BarberShopService } from '../../barber-shop/barber-shop.service';
import { ServicesService } from '../../service/service.service';
import { User } from '../../user/entity/user.entity';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { Services } from '../../service/entity/service.entity';
import { UpdateSchedulingDto } from '../dto/update-scheduling.dto';
import { Barber } from '../../barber/entity/barber.entity';
import { CreateSchedulingDto } from '../dto/create-scheduling.dto';
import { BarberService } from '../../barber/barber.service';
import { UserTypeService } from '../../user-type/user-type.service';
import { UserType } from '../../user-type/entity/user-type.entity';
import { ConflictException } from '@nestjs/common/exceptions';
import { mockScheduling } from './mocks/scheduling.mock';
import { mockUser } from '../../auth/__tests__/mocks/auth.mock';
import { mockBarberShop } from '../../barber-shop/__tests__/mocks/barbershop.mock';
import { mockBarber } from '../../barber/__tests__/mocks/barber.mock';
import { mockService } from '../../service/__tests__/mocks/service.mock';

describe('SchedulingService', () => {
  let service: SchedulingService;
  let userService: UserService;
  let barberShopService: BarberShopService;
  let barberService: BarberService;
  let servicesService: ServicesService;

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
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useValue: repositoryMockFactory<UserType>(),
        },
        BarberShopService,
        {
          provide: getRepositoryToken(BarberShop),
          useValue: repositoryMockFactory<BarberShop>(),
        },
        BarberService,
        {
          provide: getRepositoryToken(Barber),
          useValue: repositoryMockFactory<Barber>(),
        },
        ServicesService,
        {
          provide: getRepositoryToken(Services),
          useValue: repositoryMockFactory<Services>(),
        },
      ],
    }).compile();

    service = module.get<SchedulingService>(SchedulingService);
    userService = module.get<UserService>(UserService);
    barberShopService = module.get<BarberShopService>(BarberShopService);
    barberService = module.get<BarberService>(BarberService);
    servicesService = module.get<ServicesService>(ServicesService);

    repositoryMock = module.get(getRepositoryToken(Scheduling));
  });

  beforeEach(() => jest.clearAllMocks());

  describe('createScheduling', () => {
    const createSchedulingDto: CreateSchedulingDto = {
      userId: 'userId',
      barberShopId: 'barberShopId',
      barberId: 'barberId',
      serviceId: 'serviceId',
      date: new Date(),
    };

    it('Should successfully create a scheduling', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => mockScheduling });

      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(barberShopService, 'getBarberShopById')
        .mockResolvedValue(mockBarberShop);
      jest.spyOn(barberService, 'getBarberById').mockResolvedValue(mockBarber);
      jest
        .spyOn(servicesService, 'getServiceById')
        .mockResolvedValue(mockService);

      const result = await service.createScheduling(createSchedulingDto);

      expect(result).toEqual(mockScheduling);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createSchedulingDto,
        mockUser,
        mockBarberShop,
        mockBarber,
        mockService,
      });
    });

    it('Should throw the NotFoundException exception when user not found', async () => {
      const error = new NotFoundException('user not found');

      repositoryMock.findOne = jest.fn();

      jest.spyOn(userService, 'getUserById').mockRejectedValue(error);

      await expect(
        service.createScheduling(createSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('Should throw the NotFoundException exception when barbershop not found', async () => {
      const error = new NotFoundException('barbershop not found');

      repositoryMock.findOne = jest.fn();

      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(barberShopService, 'getBarberShopById')
        .mockRejectedValue(error);

      await expect(
        service.createScheduling(createSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('Should throw the NotFoundException exception when barber not found', async () => {
      const error = new NotFoundException('barber not found');

      repositoryMock.findOne = jest.fn();

      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(barberShopService, 'getBarberShopById')
        .mockResolvedValue(mockBarberShop);
      jest.spyOn(barberService, 'getBarberById').mockRejectedValue(error);

      await expect(
        service.createScheduling(createSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('Should throw the NotFoundException exception when service not found', async () => {
      const error = new NotFoundException('service not found');

      repositoryMock.findOne = jest.fn();

      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(barberShopService, 'getBarberShopById')
        .mockResolvedValue(mockBarberShop);
      jest.spyOn(barberService, 'getBarberById').mockResolvedValue(mockBarber);
      jest.spyOn(servicesService, 'getServiceById').mockRejectedValue(error);

      await expect(
        service.createScheduling(createSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('Should throw the ConflictException exception when scheduling time not available', async () => {
      const error = new ConflictException('time not available');

      repositoryMock.findOne = jest.fn().mockReturnValue(mockScheduling);

      await expect(
        service.createScheduling(createSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });
  describe('updateScheduling', () => {
    const updateSchedulingDto: UpdateSchedulingDto = {
      barberShopId: 'barbershops.id',
      barberId: 'barbers.id',
      serviceId: 'services.id',
      date: new Date(),
    };

    it('Should successfully update a scheduling', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockScheduling);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => mockScheduling });

      const result = await service.updateScheduling(
        mockScheduling.id,
        updateSchedulingDto,
      );

      expect(result).toStrictEqual(mockScheduling);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: mockScheduling.id,
        ...updateSchedulingDto,
      });
    });

    it('Should throw the NotFoundException exception when scheduling not found', async () => {
      const error = new NotFoundException('scheduling not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateScheduling(mockScheduling.id, updateSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getSchedulingById', () => {
    it('Should successfully get scheduling by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockScheduling);

      const result = await service.getSchedulingById(mockScheduling.id);

      expect(result).toStrictEqual(mockScheduling);
    });

    it('Should throw the NotFoundException exception scheduling not found', async () => {
      const error = new NotFoundException('scheduling with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getSchedulingById(mockScheduling.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getAllSchedulings', () => {
    it('Should successfully get all a scheduling', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<Scheduling> = {
        take,
        skip,
      };
      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[mockScheduling], 10]);

      const result = await service.getAllSchedulings(take, skip, null, null);
      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        schedulings: [mockScheduling],
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
        .mockReturnValue([[mockScheduling], 10]);

      const result = await service.getAllSchedulings(take, skip, userId, null);

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        schedulings: [mockScheduling],
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

      const result = await service.getAllSchedulings(take, skip, null, null);

      expect(result).toStrictEqual({
        skip: null,
        total: 0,
        schedulings: [],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteSchedulingById', () => {
    it('Should successfully delete a scheduling', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockScheduling);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteSchedulingById(mockScheduling.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw the NotFoundException exception when scheduling not found', async () => {
      const error = new NotFoundException('scheduling with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.deleteSchedulingById(mockScheduling.id),
      ).rejects.toStrictEqual(error);
    });
  });
});
