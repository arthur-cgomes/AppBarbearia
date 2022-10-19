import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MockRepository, repositoryMockFactory } from "src/utils/mock/test.util";
import { Repository } from "typeorm";
import { BarberShopService } from "../barber-shop.service"
import { BarberShop } from "../entity/barber-shop.entity";

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

    
})