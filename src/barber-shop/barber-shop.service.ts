import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { CreateBarberShopDto } from './dto/create-barbershop.dto';
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
      where: [{ name: createBarberShopDto.name }], //esta buscando somente o nome, tera mais filtros?
    });

    if (checkBarberShop)
      throw new ConflictException('barbershop already exists with this name'); //verificar o metodo de erro

    return await this.barbershopRepository
      .create({ ...createBarberShopDto })
      .save();
  }

  public async updateBarberShop(
    id: string,
    updateBarberShopDto: UpdateBarberShopDto,
  ): Promise<BarberShop> {
    await this.getBarberShopById(id);

    return await (
      await this.barbershopRepository.preload({ id, ...updateBarberShopDto })
    ).save();
  }

  public async getBarberShopById(id: string): Promise<BarberShop> {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id },
    });

    if (!barbershop)
      throw new NotFoundException('barbershop with this id not found');

    return barbershop;
  }

  public async getBarberShopByIds(ids: string[]): Promise<BarberShop[]> {
    return await this.barbershopRepository.findBy({ id: In(ids) });
  }

  public async getAllBarberShop(
    take: number,
    skip: number,
    search?: string,
  ): Promise<{
    skip: number;
    total: number;
    barbershops: BarberShop[];
  }> {
    const conditions: FindManyOptions<BarberShop> = {
      take,
      skip,
    };

    if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [barbershops, count] = await this.barbershopRepository.findAndCount(
      conditions,
    );

    if (barbershops.length == 0) {
      return { skip: null, total: 0, barbershops };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, barbershops };
  }

  public async deleteBarberShop(id: string): Promise<string> {
    const barbershop = await this.getBarberShopById(id);

    await this.barbershopRepository.remove(barbershop);

    return 'removed';              
  }
}
