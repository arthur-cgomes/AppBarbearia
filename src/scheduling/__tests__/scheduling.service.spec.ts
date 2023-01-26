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
import { Services } from '../../services/entity/services.entity';
import { UpdateSchedulingDto } from '../dto/update-scheduling.dto';
import { Barber } from '../../barber/entity/barber.entity';
import { CreateSchedulingDto } from '../dto/create-scheduling.dto';
import { BarberService } from '../../barber/barber.service';
import { UserTypeService } from '../../user-type/user-type.service';
import { UserType } from '../../user-type/entity/user-type.entity';
import { ConflictException } from '@nestjs/common/exceptions';

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

  const user: User = {
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

  const barber: Barber = {
    id: '12314-121454-ç687ih',
    name: 'name',
    cpf: 'cpf',
    email: 'email',
    phone: 'phone',
  } as Barber;

  const services: Services = {
    id: 'e2f390e3-f989-4abd-9a6f-e7679d6d9278',
    name: 'name',
    type: 'type',
    value: 'value',
  } as Services;

  const scheduling: Scheduling = {
    id: '12314-121454-ç687ih',
    date: new Date(),
    user,
    barbershops,
    barber,
    services,
  } as Scheduling;

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
        .mockReturnValue({ save: () => scheduling });

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest
        .spyOn(barberShopService, 'getBarberShopById')
        .mockResolvedValue(barbershops);
      jest.spyOn(barberService, 'getBarberById').mockResolvedValue(barber);
      jest.spyOn(servicesService, 'getServiceById').mockResolvedValue(services);

      const result = await service.createScheduling(createSchedulingDto);

      expect(result).toEqual(scheduling);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createSchedulingDto,
        user,
        barbershops,
        barber,
        services,
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

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
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

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest
        .spyOn(barberShopService, 'getBarberShopById')
        .mockResolvedValue(barbershops);
      jest.spyOn(barberService, 'getBarberById').mockRejectedValue(error);

      await expect(
        service.createScheduling(createSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('Should throw the NotFoundException exception when service not found', async () => {
      const error = new NotFoundException('service not found');

      repositoryMock.findOne = jest.fn();

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest
        .spyOn(barberShopService, 'getBarberShopById')
        .mockResolvedValue(barbershops);
      jest.spyOn(barberService, 'getBarberById').mockResolvedValue(barber);
      jest.spyOn(servicesService, 'getServiceById').mockRejectedValue(error);

      await expect(
        service.createScheduling(createSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('Should throw the ConflictException exception when scheduling time not available', async () => {
      const error = new ConflictException('time not available');

      repositoryMock.findOne = jest.fn().mockReturnValue(scheduling);

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
      repositoryMock.findOne = jest.fn().mockReturnValue(scheduling);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => scheduling });

      const result = await service.updateScheduling(
        scheduling.id,
        updateSchedulingDto,
      );

      expect(result).toStrictEqual(scheduling);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: scheduling.id,
        ...updateSchedulingDto,
      });
    });

    it('Should throw the NotFoundException exception when scheduling not found', async () => {
      const error = new NotFoundException('scheduling not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateScheduling(scheduling.id, updateSchedulingDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

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
