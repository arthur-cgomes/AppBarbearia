import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository, repositoryMockFactory } from '../../utils/mock/test.util';
import { Repository } from 'typeorm';
import { Services } from '../entity/services.entity';
import { ServicesService } from '../services.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateServiceDto } from '../dto/update-services.dto';

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

  const services: Services = {
    name: 'name',
    type: 'type',
    value: 'value',
  } as Services;

  describe('createServices', () => {
    const createServicesDto = {
      name: 'name',
      type: 'type',
      value: 'value',
    };

    it('Should successfully create a services', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => services });

      const result = await service.createService(createServicesDto);

      expect(result).toStrictEqual(services);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createServicesDto,
      });
    });

    it('Should throw the ConflictException exception services with that name already exists', async () => {
      const error = new ConflictException(
        'services with that name already exists',
      );

      repositoryMock.findOne = jest.fn().mockReturnValue(services);

      await expect(
        service.createService(createServicesDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  })

  describe('updateService', () => {
    const updateServiceDto: UpdateServiceDto = {
      name: 'name',
      type: 'type',
      value: 'value',
    };
    it('Should successfully update service', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(services);
      repositoryMock.preload = jest
      .fn()
      .mockReturnValue({ save: () => services });

      const result = await service.updateService(
        services.id,
        updateServiceDto,
      );
      expect(result).toStrictEqual(services);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: services.id,
        ...updateServiceDto,
      });
    });

    it('Should throw the NotFoundException exception when service with this id not found', async () => {
      const error = new NotFoundException('service with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateService(services.id, updateServiceDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  })

  describe('getServiceById', () => {
    it('Should successfully get service by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(services);

      const result = await service.getServiceById(services.id);

      expect(result).toStrictEqual(services);
    });

    it('Should throw the NotFoundException exception when service with this id not found', async () => {
      const error = new NotFoundException('service with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.getServiceById(services.id)).rejects.toStrictEqual(
        error,
      );
    });
  });



});
