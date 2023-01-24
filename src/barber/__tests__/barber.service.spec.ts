import { ConflictException, NotFoundException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BarberShopService } from '../../barber-shop/barber-shop.service';
import { MockRepository, repositoryMockFactory } from '../../utils/mock/test.util';
import { Repository } from 'typeorm';
import { BarberService } from '../barber.service';
import { CreateBarberDto } from '../dto/create-barber.dto';
import { Barber } from '../entity/barber.entity';
import { UpdateBarberDto } from '../dto/update-barber.dto';
describe('BarberService', () => {
  let service: BarberService;
  //let barberShopService: BarberShopService;
  let repositoryMock: MockRepository<Repository<Barber>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarberService,
        {
          provide: getRepositoryToken(Barber),
          useValue: repositoryMockFactory(),
        },
      ],
    }).compile();

    service = module.get<BarberService>(BarberService);
    //barberShopService = module.get<BarberShopService>(BarberShopService);

    repositoryMock = module.get(getRepositoryToken(Barber));
  });

  beforeEach(() => jest.clearAllMocks());

  const barber = {
    id: 'f3bce4ee-a78e-49ce-be86-2e20106a4fe8',
    cpf: '12345678901',
    name: 'name',
    email: 'email',
    phone: 'phone',
  } as Barber;

  describe('updateBarberShop', () => {
    const updateBarberDto: UpdateBarberDto = {
      name: 'name',
      email: 'email',
      phone: 'phone',
    };

    it('Should successfully update a barber', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(barber);
      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => barber });

      const result = await service.updateBarber(
        barber.id,
        updateBarberDto,
      );

      expect(result).toStrictEqual(barber);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: barber.id,
        ...updateBarberDto,
      });
    });
    it('Should throw a NotFoundException if barber does not exist', async () => {
      const error = new NotFoundException('barber not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.updateBarber(barber.id, updateBarberDto),
      ).rejects.toStrictEqual(error);
      expect(repositoryMock.preload).not.toHaveBeenCalled();
    });
  });

  describe('getBarberbyId', () => {
    it('Should successfully get a barber by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(barber);

      const result = await service.getBarberbyId(barber.id);

      expect(result).toStrictEqual(barber);
    });

    it('Should throw a NotFoundException if barber does not exist', async () => {
      const error = new NotFoundException('barber not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.getBarberbyId(barber.id)).rejects.toStrictEqual(
        error,
      );
    });
  });

  describe('deleteBarber', () => {
    it('Should successfully delete a barber', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(barber);
      repositoryMock.remove = jest.fn();

      const result = await service.deleteBarber(barber.id);

      expect(result).toStrictEqual('removed');
    });

    it('Should throw a NotFoundException if barber does not exist', async () => {
      const error = new NotFoundException('barber not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.deleteBarber(barber.id)).rejects.toStrictEqual(
        error,
      );
    });
  });
});
