import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateBarberDto } from './dto/create-barber.dto';
import { GetAllBarbersResponseDto } from './dto/get-all-barber-response.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber } from './entity/barber.entity';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
  ) {}

  public async createBarber(createBarberDto: CreateBarberDto): Promise<Barber> {
    const barber = await this.barberRepository.findOne({
      where: { document: createBarberDto.document },
    });

    if (barber) {
      throw new ConflictException('barber already exists');
    }

    return await this.barberRepository.create({ ...createBarberDto }).save();
  }

  public async updateBarber(
    barberId: string,
    updateBarberDto: UpdateBarberDto,
  ): Promise<Barber> {
    await this.getBarberById(barberId);

    return await (
      await this.barberRepository.preload({
        id: barberId,
        ...updateBarberDto,
      })
    ).save();
  }

  public async getBarberById(barberId: string): Promise<Barber> {
    const barber = await this.barberRepository.findOne({
      where: { id: barberId },
    });

    if (!barber) {
      throw new NotFoundException('barber id not found');
    }

    return barber;
  }

  public async getAllBarbers(
    take: number,
    skip: number,
    barbershopId?: string,
    search?: string,
  ): Promise<GetAllBarbersResponseDto> {
    const conditions: FindManyOptions<Barber> = {
      take,
      skip,
    };

    if (barbershopId) {
      conditions.where = { barbershop: { id: barbershopId } };
    }

    if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [barber, count] =
      await this.barberRepository.findAndCount(conditions);

    if (barber.length == 0) {
      return { skip: null, total: 0, barbers: [] };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, barbers: barber };
  }

  public async deleteBarberById(barberId: string): Promise<string> {
    const barber = await this.getBarberById(barberId);
    await this.barberRepository.remove(barber);

    return 'removed';
  }
}
