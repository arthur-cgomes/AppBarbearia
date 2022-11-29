import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberShopService } from '../barber-shop/barber-shop.service';
import { ServicesService } from '../services/services.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Scheduling } from './entity/scheduling.entity';
import { AddSchedulingDto } from './dto/add-scheduling.dto';


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
        userId: string,
        addSchedulingDto: AddSchedulingDto,
    ): Promise<Scheduling> {

        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const barbershop = await this.barberShopService.getBarberShopById(
            addSchedulingDto.barberShopId,
        );
        if (!barbershop) {
            throw new NotFoundException('barberShop not found');
        }

        const service = await this.servicesService.getServiceById(
            addSchedulingDto.serviceId,
        );
        if (!service) {
            throw new NotFoundException('service not found');
        }

        const scheduling = new Scheduling();
        scheduling.user = user;
        scheduling.barbershop = barbershop;
        scheduling.services = service;
        scheduling.date = addSchedulingDto.date;

        await this.schedulingRepository.create(scheduling).save();
        return await this.schedulingRepository.create(scheduling).save();
    }
}
