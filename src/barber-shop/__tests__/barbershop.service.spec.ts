import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MockRepository, repositoryMockFactory } from "src/utils/mock/test.util";
import { Repository } from "typeorm";
import { BarberShopService } from "../barber-shop.service"
import { BarberShop } from "../entity/barber-shop.entity";
import { CreateBarberShopDto } from "../dto/create-barbershop.dto"
import { ConflictException } from "@nestjs/common";
import { UpdateBarberShopDto } from "../dto/update-barbershop.dto";

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
            repositoryMock.create = jest.fn().mockReturnValue({ save: () => barbershop });
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
            repositoryMock.preload = jest.fn().mockReturnValue({ save: () => barbershop});

            const result = await service.updateBarberShop(
                barbershop.id,
                updateBarberShopDto,
            );
            

        })
    })
})