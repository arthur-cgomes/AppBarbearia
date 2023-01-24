import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { FindManyOptions, Repository } from 'typeorm';
import { BarberService } from '../barber.service';
import { CreateBarberDto } from '../dto/create-barber.dto';
import { Barber } from '../entity/barber.entity';
import { UpdateBarberDto } from '../dto/update-barber.dto';
describe('BarberService', () => {
  let service: BarberService;
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

  describe('createBarber', () => {
    const createBarberDto: CreateBarberDto = {
      cpf: '12345678901',
      name: 'name',
      email: 'email',
      phone: 'phone',
    };

    it('Should successfully create a barber', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest.fn().mockReturnValue({ save: () => barber });

      const result = await service.createBarber(createBarberDto);

      expect(result).toStrictEqual(barber);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createBarberDto,
      });
    });

    it('Should throw a ConflictException if barber already exists', async () => {
      const error = new ConflictException('barber already exists');

      repositoryMock.findOne = jest.fn().mockReturnValue(barber);

      await expect(service.createBarber(createBarberDto)).rejects.toStrictEqual(
        error,
      );
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    //Teste email
    //  it('Should throw a ConflictException if email already exists', async () => {
    //    const error = new ConflictException('email already exists');
    //
    //    repositoryMock.findOne = jest.fn().mockReturnValue(barber);
    //
    //    await expect(service.createBarber(createBarberDto)).rejects.toStrictEqual(
    //      error,
    //    );
    //    expect(repositoryMock.create).not.toHaveBeenCalled();
    //  });
    //});

    //Teste phone
    //it('Should throw a ConflictException if phone already exists', async () => {
    //  const error = new ConflictException('phone already exists');
    //
    //  repositoryMock.findOne = jest.fn().mockReturnValue(barber);
    //
    //  await expect(service.createBarber(createBarberDto)).rejects.toStrictEqual(
    //    error,
    //  );
    //  expect(repositoryMock.create).not.toHaveBeenCalled();
    //});

    describe('updateBarber', () => {
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

        const result = await service.updateBarber(barber.id, updateBarberDto);

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

    describe('getBarberById', () => {
      it('Should successfully get a barber by id', async () => {
        repositoryMock.findOne = jest.fn().mockReturnValue(barber);

        const result = await service.getBarberById(barber.id);

        expect(result).toStrictEqual(barber);
      });

      it('Should throw a NotFoundException if barber does not exist', async () => {
        const error = new NotFoundException('barber not found');

        repositoryMock.findOne = jest.fn();

        await expect(service.getBarberById(barber.id)).rejects.toStrictEqual(
          error,
        );
      });
    });

    describe('getAllBarbers', () => {
      it('Should successfully get all barbers', async () => {
        const take = 1;
        const skip = 0;
        const conditions: FindManyOptions<Barber> = {
          take,
          skip,
        };
        repositoryMock.findAndCount.mockResolvedValue([[barber], 10]);

        const result = await service.getAllBarbers(take, skip, null);

        expect(result).toStrictEqual({
          skip: 1,
          total: 10,
          barbers: [barber],
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
      });

      it('Should successfully get all barbers with barberId', async () => {
        const barberId = 'barberId';
        const take = 10;
        const skip = 0;
        const conditions: FindManyOptions<Barber> = {
          take,
          skip,
          where: { id: barberId },
        };

        repositoryMock.findAndCount = jest.fn().mockReturnValue([[barber], 10]);

        const result = await service.getAllBarbers(take, skip, barberId);

        expect(result).toStrictEqual({
          skip: null,
          total: 10,
          barbers: [barber],
        });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
      });

      it('Should successfully return an empty list of barbers', async () => {
        const take = 10;
        const skip = 10;
        const conditions: FindManyOptions<Barber> = {
          take,
          skip,
        };

        repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

        const result = await service.getAllBarbers(take, skip, null);

        expect(result).toStrictEqual({ skip: null, total: 0, barbers: [] });
        expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
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
});
