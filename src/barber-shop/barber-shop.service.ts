import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { CreateBarberShopDto } from './dto/create-barbershop.dto';
import { GetAllBarberShopResponseDto } from './dto/get-all-barbershop.dto';
import { UpdateBarberShopDto } from './dto/update-barbershop.dto';
import { BarberShop } from './entity/barber-shop.entity';

@Injectable()
export class BarberShopService {
  constructor(
    @InjectRepository(BarberShop)
    private readonly barbershopRepository: Repository<BarberShop>,
  ) {}

  public async createBarberShop(
    createBarberShopDto: CreateBarberShopDto,
  ): Promise<BarberShop> {
    const checkBarberShop = await this.barbershopRepository.findOne({
      where: { document: createBarberShopDto.document },
    });

    if (checkBarberShop)
      throw new ConflictException('barbershop already exists with this CNPJ');

    return await this.barbershopRepository
      .create({ ...createBarberShopDto })
      .save();
  }

  public async updateBarberShop(
    barbershopId: string,
    updateBarberShopDto: UpdateBarberShopDto,
  ): Promise<BarberShop> {
    await this.getBarberShopById(barbershopId);

    return await (
      await this.barbershopRepository.preload({
        id: barbershopId,
        ...updateBarberShopDto,
      })
    ).save();
  }

  public async getBarberShopById(barbershopId: string): Promise<BarberShop> {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id: barbershopId },
    });

    if (!barbershop)
      throw new NotFoundException('barbershop with this id not found');

    return barbershop;
  }

  public async getBarberShopByIds(ids: string[]): Promise<BarberShop[]> {
    return await this.barbershopRepository.findBy({ id: In(ids) });
  }

  public async getAllBarberShops(
    take: number,
    skip: number,
    sort: string,
    order: 'ASC' | 'DESC',
    document?: string,
    search?: string,
  ): Promise<GetAllBarberShopResponseDto> {
    const conditions: FindManyOptions<BarberShop> = {
      take,
      skip,
      order: {
        [sort]: order,
      },
    };

    if (document) {
      conditions.where = { document };
    }

    if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [barbershops, count] =
      await this.barbershopRepository.findAndCount(conditions);

    if (barbershops.length == 0) {
      return { skip: null, total: 0, barbershops };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, barbershops };
  }

  public async deleteBarberShopById(barbershopId: string): Promise<string> {
    const barberShop = await this.getBarberShopById(barbershopId);
    await this.barbershopRepository.remove(barberShop);

    return 'removed';
  }
}
