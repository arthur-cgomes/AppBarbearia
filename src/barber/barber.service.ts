import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const cpf = await this.barberRepository.findOne({
      where: [{ cpf: createBarberDto.cpf }],
    });
    if (cpf) {
      throw new ConflictException('barber already exists');
    }

    const email = await this.barberRepository.findOne({
      where: [{ email: createBarberDto.email }],
    });
    if (email) {
      throw new ConflictException('email already exists');
    }

    const phone = await this.barberRepository.findOne({
      where: [{ phone: createBarberDto.phone }],
    });
    if (phone) {
      throw new ConflictException('phone already exists');
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

  public async getBarberbyId(barberId: string): Promise<Barber> {
    const barber = await this.barberRepository.findOne({
      where: [{ id: barberId }],
    });
    if (!barber) {
      throw new NotFoundException('barber not found');
    }
    return barber;
  }

  //Fazer o getAllBarbers

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
