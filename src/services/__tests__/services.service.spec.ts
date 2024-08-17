import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../common/mock/test.util';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Services } from '../entity/services.entity';
import { ServicesService } from '../services.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateServiceDto } from '../dto/update-services.dto';
import { ServiceType } from '../../common/enum/service-type.enum';
import { mockService } from './mocks/service.mock';

describe('ServicesService', () => {
  let service: ServicesService;
  let repositoryMock: MockRepository<Repository<Services>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Services),
          useValue: repositoryMockFactory<Services>(),
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);

    repositoryMock = module.get(getRepositoryToken(Services));
  });

  beforeEach(() => jest.resetAllMocks());

  describe('createServices', () => {
    const createServicesDto = {
      name: 'name',
      type: ServiceType.HAIR,
      value: 'value',
      barberShopId: 'barberShopId',
    };

    it('Should successfully create a service', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => mockService });

      const result = await service.createService(createServicesDto);

      expect(result).toStrictEqual(mockService);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createServicesDto,
      });
    });

    it('Should throw the ConflictException exception services with that name already exists', async () => {
      const error = new ConflictException(
        'services with that name already exists',
      );

      repositoryMock.findOne = jest.fn().mockReturnValue(mockService);

      await expect(
        service.createService(createServicesDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateService', () => {
    const updateServiceDto: UpdateServiceDto = {
      name: 'name',
      type: ServiceType.HAIR,
      value: 'value',
    };
    it('Should successfully update service', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockService);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => mockService });

      const result = await service.updateService(
        mockService.id,
        updateServiceDto,
      );
      expect(result).toStrictEqual(mockService);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: mockService.id,
        ...updateServiceDto,
      });
    });

    it('Should throw the NotFoundException exception when service with this id not found', async () => {
      const error = new NotFoundException('service with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateService(mockService.id, updateServiceDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getServiceById', () => {
    it('Should successfully get service by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockService);

      const result = await service.getServiceById(mockService.id);

      expect(result).toStrictEqual(mockService);
    });

    it('Should throw the NotFoundException exception when service with this id not found', async () => {
      const error = new NotFoundException('service with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getServiceById(mockService.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getAllServices', () => {
    it('Should successfully a list of services', async () => {
      const take = 1;
      const skip = 0;
      const serviceId = '';
      const search = '';
      const barberShopId = '';

      const conditions: FindManyOptions<Services> = {
        take,
        skip,
        where: {},
      };
      repositoryMock.findAndCount = jest.fn().mockReturnValue([[service], 10]);

      const result = await service.getAllServices(
        take,
        skip,
        serviceId,
        search,
        barberShopId,
      );

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        services: [service],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all services with serviceId', async () => {
      const serviceId = 'serviceId';
      const take = 1;
      const skip = null;
      const search = '';
      const barberShopId = '';

      const conditions: FindManyOptions<Services> = {
        take,
        skip,
        where: { id: serviceId },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[service], 10]);

      const result = await service.getAllServices(
        take,
        skip,
        serviceId,
        search,
        barberShopId,
      );

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        services: [service],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all services with serviceName', async () => {
      const search = 'search';
      const take = 1;
      const skip = null;
      const serviceId = '';
      const barberShopId = '';

      const conditions: FindManyOptions<Services> = {
        take,
        skip,
        where: { name: ILike('%' + search + '%') },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[service], 10]);

      const result = await service.getAllServices(
        take,
        skip,
        serviceId,
        search,
        barberShopId,
      );

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        services: [service],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all services with barberShopId', async () => {
      const barberShopId = 'barberShopId';
      const take = 1;
      const skip = null;
      const serviceId = '';
      const search = '';

      const conditions: FindManyOptions<Services> = {
        take,
        skip,
        where: { barberShop: { id: barberShopId } },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[service], 10]);

      const result = await service.getAllServices(
        take,
        skip,
        serviceId,
        search,
        barberShopId,
      );

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        services: [service],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of services', async () => {
      const take = 1;
      const skip = 0;
      const serviceId = '';
      const search = '';
      const barberShopId = '';

      const conditions: FindManyOptions<Services> = {
        take,
        skip,
        where: {},
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllServices(
        take,
        skip,
        serviceId,
        search,
        barberShopId,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 0,
        services: [],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should set skip to null when no more results are available', async () => {
      const take = 5;
      const skip = 5;
      const serviceId = '';
      const search = '';
      const barberShopId = '';

      const conditions: FindManyOptions<Services> = {
        take,
        skip,
        where: {},
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[service], 5]);

      const result = await service.getAllServices(
        take,
        skip,
        serviceId,
        search,
        barberShopId,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 5,
        services: [service],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should increment skip when more results are available', async () => {
      const take = 5;
      const skip = 0;
      const serviceId = '';
      const search = '';
      const barberShopId = '';

      const conditions: FindManyOptions<Services> = {
        take,
        skip,
        where: {},
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[service], 15]);

      const result = await service.getAllServices(
        take,
        skip,
        serviceId,
        search,
        barberShopId,
      );

      expect(result).toStrictEqual({
        skip: 5,
        total: 15,
        services: [service],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteService', () => {
    it('Should successfully delete a service', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(service);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteServiceById(mockService.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw the NotFoundException exception when service id not found', async () => {
      const error = new NotFoundException('service with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.deleteServiceById(mockService.id),
      ).rejects.toStrictEqual(error);
    });
  });
});
