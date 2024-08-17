import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberShopService } from '../barber-shop/barber-shop.service';
import { ServicesService } from '../services/services.service';
import { UserService } from '../user/user.service';
import { FindManyOptions, Repository } from 'typeorm';
import { Scheduling } from './entity/scheduling.entity';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { GetAllSchedulingResponseDto } from './dto/get-all-scheduling-response.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { BarberService } from '../barber/barber.service';

@Injectable()
export class SchedulingService {
  constructor(
    private readonly userService: UserService,
    private readonly barbershopService: BarberShopService,
    private readonly barberService: BarberService,
    private readonly servicesService: ServicesService,
    @InjectRepository(Scheduling)
    private readonly schedulingRepository: Repository<Scheduling>,
  ) {}

  public async createScheduling(
    createSchedulingDto: CreateSchedulingDto,
  ): Promise<Scheduling> {
    const [user, barbershop, barber, service] = await Promise.all([
      this.userService.getUserById(createSchedulingDto.userId),
      this.barbershopService.getBarberShopById(
        createSchedulingDto.barberShopId,
      ),
      this.barberService.getBarberById(createSchedulingDto.barberId),
      this.servicesService.getServiceById(createSchedulingDto.serviceId),
    ]);

    const checkScheduling = await this.schedulingRepository.findOne({
      where: [
        {
          date: createSchedulingDto.date,
          barbershop: { id: createSchedulingDto.barberShopId },
        },
      ],
    });

    if (checkScheduling) {
      throw new ConflictException('time not available');
    }

    const scheduling = new Scheduling();
    scheduling.user = user;
    scheduling.barbershop = barbershop;
    scheduling.barber = barber;
    scheduling.services = [service];
    scheduling.date = createSchedulingDto.date;

    return await this.schedulingRepository.create(scheduling).save();
  }

  public async updateScheduling(
    schedulingId: string,
    updateSchedulingDto: UpdateSchedulingDto,
  ): Promise<Scheduling> {
    await this.getSchedulingById(schedulingId);

    return await (
      await this.schedulingRepository.preload({
        id: schedulingId,
        ...updateSchedulingDto,
      })
    ).save();
  }

  public async getSchedulingById(schedulingId: string): Promise<Scheduling> {
    const scheduling = await this.schedulingRepository.findOne({
      where: { id: schedulingId },
    });

    if (!scheduling) {
      throw new NotFoundException('scheduling with this id not found');
    }

    return scheduling;
  }

  public async getAllSchedulings(
    take: number,
    skip: number,
    userId?: string,
    barberId?: string,
    barberShopId?: string,
  ): Promise<GetAllSchedulingResponseDto> {
    const conditions: FindManyOptions<Scheduling> = {
      take,
      skip,
    };

    if (userId) {
      conditions.where = { id: userId };
    }

    if (barberId) {
      conditions.where = { barber: { id: barberId } };
    }

    if (barberShopId) {
      conditions.where = { barbershop: { id: barberShopId } };
    }

    const [scheduling, count] =
      await this.schedulingRepository.findAndCount(conditions);

    if (scheduling.length == 0) {
      return { skip: null, total: 0, schedulings: [] };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, schedulings: scheduling };
  }

  public async deleteSchedulingById(schedulingId: string): Promise<string> {
    const deleteScheduling = await this.getSchedulingById(schedulingId);
    await this.schedulingRepository.remove(deleteScheduling);

    return 'removed';
  }
}
