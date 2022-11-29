import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberShopService } from '../barber-shop/barber-shop.service';
import { ServicesService } from '../services/services.service';
import { UserService } from '../user/user.service';
import { FindManyOptions, Repository } from 'typeorm';
import { Scheduling } from './entity/scheduling.entity';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { GetAllSchedulingResponseDto } from './dto/get-all-scheduling-response.dto';


@Injectable()
export class SchedulingService {
    constructor(
        private readonly userService: UserService,
        private readonly barberShopService: BarberShopService,
        private readonly servicesService: ServicesService,
        @InjectRepository(Scheduling)
        private readonly schedulingRepository: Repository<Scheduling>,
    ) { }

    public async createScheduling(
        createSchedulingDto: CreateSchedulingDto,
    ): Promise<Scheduling> {

        const user = await this.userService.getUserById(
            createSchedulingDto.userId,
        );
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const barbershop = await this.barberShopService.getBarberShopById(
            createSchedulingDto.barberShopId,
        );
        if (!barbershop) {
            throw new NotFoundException('barberShop not found');
        }

        const service = await this.servicesService.getServiceById(
            createSchedulingDto.serviceId,
        );
        if (!service) {
            throw new NotFoundException('service not found');
        }

        const scheduling = new Scheduling();
        scheduling.users = user;
        scheduling.barbershops = barbershop;
        scheduling.services = service;

        await this.schedulingRepository.create(scheduling).save();
        return await this.schedulingRepository.create(scheduling).save();
    }

    public async updateScheduling(
        id: string,
        updateSchedulingDto: CreateSchedulingDto,
    ): Promise<Scheduling> {
        const scheduling = await this.schedulingRepository.findOne({
            where: { id }
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
            throw new NotFoundException('scheduling not found');
        }

        return scheduling;
    }

    public async getAllScheduling(
        take: number,
        skip: number,
        userId: string,
        schedulingId?: string,
      ): Promise<GetAllSchedulingResponseDto> {
        const conditions: FindManyOptions<Scheduling> = {
          take,
          skip,
        };
    
        if (userId) {
          conditions.where = { id: userId };
        } else if (schedulingId) {
          conditions.where = { id: schedulingId };
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


    public async deleteScheduling(schedulingId: string): Promise<string> {
        const deleteScheduling = await this.schedulingRepository.findOne({
            where: { id: schedulingId },
        });

        if (!deleteScheduling) {
            throw new NotFoundException('scheduling not found');
        }

        await this.schedulingRepository.remove(deleteScheduling);

        return 'removed';
    }
}
