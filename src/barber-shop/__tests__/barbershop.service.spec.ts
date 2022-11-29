import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { FindManyOptions, ILike, Repository } from 'typeorm';
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
      cnpj: '62780460000137',
      address: 'adress',
      phone: 'phone',
      email: 'email',
    };

    it('Should successfully create a barbershop', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest
        .fn()
        .mockReturnValue({ save: () => barbershop });
      const result = await service.createBarberShop(createBarbershopDto);

      expect(result).toStrictEqual(barbershop);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createBarbershopDto,
      });
    });

    it('Should throw a ConflictException if barbershop already exists', async () => {
      const error = new ConflictException(
        'barbershop already exists with this CNPJ',
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
      cnpj: '62780460000137',
      address: 'adress',
      phone: 'phone',
      email: 'email',
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

      await expect(
        service.getBarberShopById(barbershop.id),
      ).rejects.toStrictEqual(error);
    });
  });

  describe('getBarberShopByIds', () => {
    it('Should successfully get barbershop by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([barbershop]);

      const result = await service.getBarberShopByIds([barbershop.id]);

      expect(result).toStrictEqual([barbershop]);
    });
  });

  describe('getAllBarbaerShops', () => {
    it('Should successfully get all barbershops', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<BarberShop> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[barbershop], 10]);

      const result = await service.getAllBarberShop(take, skip, null);

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        barbershops: [barbershop],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully get all barbershop with search', async () => {
      const search = 'Test';
      const take = 10;
      const skip = 0;

      const conditions: FindManyOptions<BarberShop> = {
        take,
        skip,
        where: { name: ILike('%' + search + '%') },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[barbershop], 10]);

      const result = await service.getAllBarberShop(take, skip, search);

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        barbershops: [barbershop],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('Should successfully return an empty list of barbershops', async () => {
      const take = 10;
      const skip = 10;
      const conditions: FindManyOptions<BarberShop> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllBarberShop(take, skip, null);

      expect(result).toStrictEqual({ skip: null, total: 0, barbershops: [] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteBarberShop', () => {
    it('Should successfully delete a barbershop', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(barbershop);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteBarberShop(barbershop.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw a NotFoundException if barbershop does not exist', async () => {
      const error = new NotFoundException('barbershop with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.deleteBarberShop(barbershop.id),
      ).rejects.toStrictEqual(error);
    });
  });
});
