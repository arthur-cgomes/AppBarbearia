import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBarberDto } from './dto/create-barber.dto';
import { Barber } from './entity/barber.entity';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
  ) {}

  public async createBarber(createBarberDto: CreateBarberDto): Promise<Barber> {
    const checkBarber = await this.barberRepository.findOne({
      where: [{ name: createBarberDto.name, phone: createBarberDto.phone }],
    });
// TESTANDO ELSE IF
    if (checkBarber.name)
      throw new ConflictException('barber already exists with this name');
    else if (checkBarber.phone)
      throw new ConflictException('this number is already registered');

    return await this.barberRepository
    .create({ ...createBarberDto })
    .save();
  }
}
