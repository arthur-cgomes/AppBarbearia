import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber } from './entity/barber.entity';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
  ) {}

  public async createBarber(createBarberDto: CreateBarberDto): Promise<Barber> {
    const checkBarber = await this.barberRepository.findOne({
      where: [{ cpf: createBarberDto.cpf, phone: createBarberDto.phone }],
    });
    if (checkBarber.cpf)
      throw new ConflictException('barber already registered');
    else if (checkBarber.phone)
      throw new ConflictException('this number is already registered');

    return await this.barberRepository.create({ ...createBarberDto }).save();
  }

  public async updateBarber(
    id: string,
    updateBarberDto: UpdateBarberDto,
  ): Promise<Barber> {
    await this.getBarberById(id);

    return await (
      await this.barberRepository.preload({ 
        id,
        ...updateBarberDto })
    ).save();
  }

  public async getBarberById(barberId: string): Promise<Barber> {
    const getBarber = await this.barberRepository.findOne({
      where: [{ id: barberId }],
    });

    if (!getBarber)
      throw new NotFoundException('barber with this id not found');

    return getBarber;
  }

  public async getAllBarbers(
    take: number,
    skip: number,
    barberId: string,
    search?: string,
  ): Promise<{
    skip: number;
    total: number;
    barbers: Barber[];
  }> {
    const conditions: FindManyOptions<Barber> = {
      take,
      skip,
    };

    if (barberId) {
      conditions.where = { id: barberId };
    } else if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [barbers, count] = await this.barberRepository.findAndCount(
      conditions,
    );

    if (barbers.length == 0) {
      return { skip: null, total: 0, barbers };
    }
    const over = count - Number(skip) + Number(take);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, barbers };
  }

  public async deleteBarber(barberId: string): Promise<string> {
    const deleteBarber = await this.barberRepository.findOne({
      where: { id: barberId },
    });
    if (!deleteBarber) {
      throw new NotFoundException('barber with this id not found');
    }
    await this.barberRepository.delete(barberId);
    return 'removed';
  }
}
