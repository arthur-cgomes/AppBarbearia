import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
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
      where: [
        { cpf: createBarberDto.cpf },
        { email: createBarberDto.email },
        { phone: createBarberDto.phone },
      ],
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
    const barber = await this.barberRepository.findOne({
      where: [{ id: barberId }],
    });
    if (!barber) {
      throw new NotFoundException('barber not found');
    }
    return await (
      await this.barberRepository.preload({
        id: barberId,
        ...updateBarberDto,
      })
    ).save();
  }

  public async getBarberById(barberId: string): Promise<Barber> {
    const barber = await this.barberRepository.findOne({
      where: [{ id: barberId }],
    });
    if (!barber) {
      throw new NotFoundException('barber not found');
    }
    return barber;
  }

  public async getAllBarbers(
    take: number,
    skip: number,
    barberId?: string,
  ): Promise<GetAllBarbersResponseDto> {
    const conditions: FindManyOptions<Barber> = {
      take,
      skip,
    };

    if (barberId) {
      conditions.where = { id: barberId };
    }

    const [barber, count] = await this.barberRepository.findAndCount(
      conditions,
    );

    if (barber.length == 0) {
      return { skip: null, total: 0, barbers: [] };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, barbers: barber };
  }

  public async deleteBarber(barberId: string): Promise<string> {
    const barber = await this.barberRepository.findOne({
      where: [{ id: barberId }],
    });
    if (!barber) {
      throw new NotFoundException('barber not found');
    }
    await this.barberRepository.remove(barber);
    return 'removed';
  }
}
