import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { Repository } from 'typeorm';
import { BarberShopService } from '../barber-shop.service';
import { CreateBarberShopDto } from '../dto/create-barbershop.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateBarberShopDto } from '../dto/update-barbershop.dto';
import { BarberShop } from '../entity/barber-shop.entity';

describe('BarberShopService', () => {
  let service: BarberShopService;
  let repositoryMock: MockRepository<Repository<BarberShop>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarberShopService,
        {
          provide: getRepositoryToken(BarberShop),
          useValue: repositoryMockFactory<BarberShop>(),
        },
      ],
    }).compile();

    service = module.get<BarberShopService>(BarberShopService);
    repositoryMock = module.get(getRepositoryToken(BarberShop));
  });

  beforeEach(() => jest.clearAllMocks());

  const barbershop: BarberShop = {
    id: '12314-121454-ç687ih',
    name: 'Teste',
    active: true,
  } as BarberShop;

  describe('createbarbershop', () => {
    const createBarbershopDto: CreateBarberShopDto = {
      name: 'Teste',
    };

    it('Should successfully create a barbershop', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => barbershop });
      console.log();
      const result = await service.createBarberShop(createBarbershopDto);

      expect(result).toStrictEqual(barbershop);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createBarbershopDto,
      });
    });

    it('Should throw a ConflictException if barbershop already exists', async () => {
      const error = new ConflictException(
        'barbershop already exists with this name',
      );
      repositoryMock.findOne = jest.fn().mockReturnValue(barbershop);

      await expect(
        service.createBarberShop(createBarbershopDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateBarberShop', () => {
    const updateBarberShopDto: UpdateBarberShopDto = {
      name: 'TestingUpdate',
    };

    it('Should successfully update a barbershop', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(barbershop);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => barbershop });

      const result = await service.updateBarberShop(
        barbershop.id,
        updateBarberShopDto,
      );

      expect(result).toStrictEqual(barbershop);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: barbershop.id,
        ...updateBarberShopDto,
      });
    });

    it('Should throw a NotFoundException if barbershop does not exist', async () => {
      const error = new NotFoundException('barbershop with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateBarberShop(barbershop.id, updateBarberShopDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getBarberShopById', () => {
    it('Should successfully get a barbershop by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(barbershop);

      const result = await service.getBarberShopById(barbershop.id);

      expect(result).toStrictEqual(barbershop);
    });

    it('Should throw a NotFoundException if barbershop does not exist', async () => {
      const error = new NotFoundException('barbershop with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.getBarberShopById(barbershop.id)).rejects.toStrictEqual(
        error,
      );
    });
  });
});
