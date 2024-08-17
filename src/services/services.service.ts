import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-services.dto';
import { GetAllServicesResponseDto } from './dto/get-all-services.dto';
import { UpdateServiceDto } from './dto/update-services.dto';
import { Services } from './entity/services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
  ) {}

  public async createService(
    createServiceDto: CreateServiceDto,
  ): Promise<Services> {
    const chekService = await this.servicesRepository.findOne({
      where: {
        name: createServiceDto.name,
        barberShop: { id: createServiceDto.barberShopId },
      },
    });

    if (chekService) {
      throw new ConflictException('services with that name already exists');
    }

    return await this.servicesRepository.create({ ...createServiceDto }).save();
  }

  public async updateService(
    serviceId: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Services> {
    await this.getServiceById(serviceId);

    return await (
      await this.servicesRepository.preload({
        id: serviceId,
        ...updateServiceDto,
      })
    ).save();
  }

  public async getServiceById(serviceId: string): Promise<Services> {
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
      relations: ['barberShop'],
    });

    if (!service) throw new NotFoundException('service with this id not found');

    return service;
  }

  public async getAllServices(
    take: number,
    skip: number,
    barberShopId?: string,
    search?: string,
  ): Promise<GetAllServicesResponseDto> {
    const conditions: FindManyOptions<Services> = {
      take,
      skip,
      where: {},
    };

    if (barberShopId) {
      conditions.where = {
        ...conditions.where,
        barberShop: { id: barberShopId },
      };
    }

    if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [services, count] =
      await this.servicesRepository.findAndCount(conditions);

    if (services.length == 0) {
      return { skip: null, total: 0, services };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, services };
  }

  public async deleteServiceById(serviceId: string): Promise<string> {
    const deleteService = await this.getServiceById(serviceId);
    await this.servicesRepository.remove(deleteService);

    return 'removed';
  }
}
