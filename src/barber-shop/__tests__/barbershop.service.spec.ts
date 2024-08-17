import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../common/mock/test.util';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { BarberShopService } from '../barber-shop.service';
import { CreateBarberShopDto } from '../dto/create-barbershop.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateBarberShopDto } from '../dto/update-barbershop.dto';
import { BarberShop } from '../entity/barber-shop.entity';
import { mockBarberShop } from './mocks/barbershop.mock';

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

  describe('createbarbershop', () => {
    const createBarbershopDto: CreateBarberShopDto = {
      name: 'Teste',
      document: '62780460000137',
      address: 'adress',
      lat: 'lat',
      long: 'long',
      cellphone: 'phone',
      email: 'email',
    };

    it('Should successfully create a barbershop', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => mockBarberShop });
      const result = await service.createBarberShop(createBarbershopDto);

      expect(result).toStrictEqual(mockBarberShop);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createBarbershopDto,
      });
    });

    it('Should throw a ConflictException if barbershop already exists', async () => {
      const error = new ConflictException(
        'barbershop already exists with this CNPJ',
      );
      repositoryMock.findOne = jest.fn().mockReturnValue(mockBarberShop);

      await expect(
        service.createBarberShop(createBarbershopDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateBarberShop', () => {
    const updateBarberShopDto: UpdateBarberShopDto = {
      name: 'Teste',
      document: '62780460000137',
      address: 'adress',
      lat: 'lat',
      long: 'long',
      cellphone: 'phone',
      email: 'email',
    };

    it('Should successfully update a barbershop', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockBarberShop);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => mockBarberShop });

      const result = await service.updateBarberShop(
        mockBarberShop.id,
        updateBarberShopDto,
      );

      expect(result).toStrictEqual(mockBarberShop);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: mockBarberShop.id,
        ...updateBarberShopDto,
      });
    });

    it('Should throw a NotFoundException if barbershop does not exist', async () => {
      const error = new NotFoundException('barbershop with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateBarberShop(mockBarberShop.id, updateBarberShopDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getBarberShopById', () => {
    it('Should successfully get a barbershop by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockBarberShop);

      const result = await service.getBarberShopById(mockBarberShop.id);

      expect(result).toStrictEqual(mockBarberShop);
    });

    it('Should throw a NotFoundException if barbershop does not exist', async () => {
      const error = new NotFoundException('barbershop with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getBarberShopById(mockBarberShop.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getBarberShopByIds', () => {
    it('Should successfully get barbershop by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([mockBarberShop]);

      const result = await service.getBarberShopByIds([mockBarberShop.id]);

      expect(result).toStrictEqual([mockBarberShop]);
    });
  });

  describe('getAllBarberShops', () => {
    it('Should successfully get all barbershops', async () => {
      const take = 1;
      const skip = 0;
      const search = '';

      const conditions: FindManyOptions<BarberShop> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[mockBarberShop], 10]);

      const result = await service.getAllBarberShops(take, skip, search);

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        barbershops: [mockBarberShop],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all barbershop with search', async () => {
      const search = 'search';
      const take = 10;
      const skip = 0;

      const conditions: FindManyOptions<BarberShop> = {
        take,
        skip,
        where: { name: ILike('%' + search + '%') },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[mockBarberShop], 10]);

      const result = await service.getAllBarberShops(take, skip, search);

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        barbershops: [mockBarberShop],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of barbershops', async () => {
      const take = 10;
      const skip = 10;
      const search = '';

      const conditions: FindManyOptions<BarberShop> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllBarberShops(take, skip, search);

      expect(result).toStrictEqual({ skip: null, total: 0, barbershops: [] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteBarberShopById', () => {
    it('Should successfully delete a barbershop', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(mockBarberShop);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteBarberShopById(mockBarberShop.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw a NotFoundException if barbershop does not exist', async () => {
      const error = new NotFoundException('barbershop with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.deleteBarberShopById(mockBarberShop.id),
      ).rejects.toStrictEqual(error);
    });
  });
});
