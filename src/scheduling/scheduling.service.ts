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
import { threadId } from 'worker_threads';

@Injectable()
export class SchedulingService {
  constructor(
    private readonly userService: UserService,
    private readonly barbershopService: BarberShopService,
    private readonly barberService: BarberService,
    private readonly servicesService: ServicesService,
    @InjectRepository(Scheduling)
    private readonly schedulingRepository: Repository<Scheduling>,
  ) { }

  public async createScheduling(
    createSchedulingDto: CreateSchedulingDto,
  ): Promise<Scheduling> {
    const user = await this.userService.getUserById(createSchedulingDto.userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const barbershop = await this.barbershopService.getBarberShopById(
      createSchedulingDto.barberShopId,
    );
    if (!barbershop) {
      throw new NotFoundException('barberShop not found');
    }

    const barber = await this.barberService.getBarberById(
      createSchedulingDto.barberId,
      );
    if (!barber) {
      throw new NotFoundException('barber not found');
    }

    const service = await this.servicesService.getServiceById(
      createSchedulingDto.serviceId,
    );
    if (!service) {
      throw new NotFoundException('service not found');
    }

    const checkScheduling = await this.schedulingRepository.findOne({
      where: [
        {
          date: createSchedulingDto.date,
          barbershops: { id: createSchedulingDto.barberShopId },
          barbers: { id: createSchedulingDto.barberId },
        },
      ],
    });
    if (checkScheduling) {
      throw new ConflictException('time not available');
    }

    const scheduling = new Scheduling();
    scheduling.users = user;
    scheduling.barbershops = barbershop;
    scheduling.barbers = barber;
    scheduling.services = service;
    scheduling.date = createSchedulingDto.date;

    return await this.schedulingRepository.create(scheduling).save();
  }

  public async updateScheduling(
    schedulingId: string,
    updateSchedulingDto: UpdateSchedulingDto,
  ): Promise<Scheduling> {
    const scheduling = await this.schedulingRepository.findOne({
      where: { id: schedulingId },
    });

    if (!scheduling) {
      throw new NotFoundException('scheduling not found');
    }

    return await (
      await this.schedulingRepository.preload({
        id: scheduling.id,
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

  public async getAllScheduling(
    take: number,
    skip: number,
    userId?: string,
    schedulingId?: string,
  ): Promise<GetAllSchedulingResponseDto> {
    const conditions: FindManyOptions<Scheduling> = {
      take,
      skip,
    };

    if (userId) {
      conditions.where = { id: userId };
    }

    if (schedulingId) {
      conditions.where = { id: schedulingId };
    }

    const [scheduling, count] = await this.schedulingRepository.findAndCount(
      conditions,
    );

    if (scheduling.length == 0) {
      return { skip: null, total: 0, schedulings: [] };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, schedulings: scheduling };
  }

  public async deleteScheduling(schedulingId: string): Promise<string> {
    const deleteScheduling = await this.schedulingRepository.findOne({
      where: { id: schedulingId },
    });

    if (!deleteScheduling) {
      throw new NotFoundException('scheduling with this id not found');
    }

    await this.schedulingRepository.remove(deleteScheduling);

    return 'removed';
  }
}
